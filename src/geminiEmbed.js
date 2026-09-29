export const getApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) {
    return process.env.VITE_GEMINI_API_KEY;
  }
  return '';
};

export const DEFAULT_GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-3.8-flash'
];

export const formatModelDisplayName = (modelName) => {
  if (!modelName) return 'Gemini 2.5 Flash';
  if (modelName.includes('2.5-flash')) return 'Gemini 2.5 Flash';
  if (modelName.includes('flash-latest')) return 'Gemini Flash';
  if (modelName.includes('3.8-flash')) return 'Gemini 3.8 Flash';
  if (modelName.includes('3.5-flash')) return 'Gemini 3.5 Flash';
  return modelName.replace('models/', '');
};

// Modern Gemini embeddings with automated fallback
export const generateEmbeddings = async (text) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API key is missing.");

  const embeddingModels = ['gemini-embedding-001', 'gemini-embedding-2'];
  let lastError = null;

  for (const model of embeddingModels) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${model}`,
          content: { parts: [{ text }] }
        })
      });

      if (!response.ok) {
        lastError = new Error(`Gemini Embedding Error (${model}): ${response.status} ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      if (data?.embedding?.values) {
        return data.embedding.values;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to generate embeddings with all models.");
};

export const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// --- ROBUST STREAMING FUNCTION WITH AUTOMATED MODEL FALLBACK ---
export const streamGeminiResponse = async (messages, onChunk, onComplete, onError, options = {}) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    if (onError) onError(new Error("API key is missing."));
    return;
  }

  const modelsToTry = options.models || DEFAULT_GEMINI_MODELS;
  let systemInstructionText = options.systemInstruction || '';

  // Handle legacy payload where system prompt was injected as index 0 and 1
  let sourceMessages = [...messages];
  if (!systemInstructionText && sourceMessages.length >= 2) {
    if (
      sourceMessages[0]?.role === 'user' &&
      sourceMessages[1]?.role === 'model' &&
      sourceMessages[1]?.content?.includes("Understood")
    ) {
      systemInstructionText = sourceMessages[0].content;
      sourceMessages = sourceMessages.slice(2);
    }
  }

  // Filter and normalize alternating turns (user -> model -> user -> ...)
  let formattedContents = [];
  for (const msg of sourceMessages) {
    if (!msg || !msg.content || !msg.content.trim()) continue;
    const role = msg.role === 'user' ? 'user' : 'model';

    // Merge adjacent turns of same role to maintain strict Gemini API alternating structure
    if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === role) {
      formattedContents[formattedContents.length - 1].parts[0].text += '\n\n' + msg.content.trim();
    } else {
      formattedContents.push({
        role,
        parts: [{ text: msg.content.trim() }]
      });
    }
  }

  // Gemini contents must begin with a user turn
  if (formattedContents.length > 0 && formattedContents[0].role === 'model') {
    formattedContents = formattedContents.slice(1);
  }

  if (formattedContents.length === 0) {
    if (onError) onError(new Error("No conversation messages to send."));
    return;
  }

  let lastError = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    try {
      const bodyPayload = {
        contents: formattedContents
      };

      if (systemInstructionText) {
        bodyPayload.systemInstruction = {
          parts: [{ text: systemInstructionText }]
        };
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:streamGenerateContent?alt=sse&key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyPayload)
        }
      );

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        console.warn(`[Gemini] ${currentModel} returned HTTP ${response.status}. Attempting fallback...`, errorBody.slice(0, 150));
        lastError = new Error(`Gemini API error (${currentModel}): ${response.status}`);
        continue; // Try next fallback model
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";

      const processText = async ({ done, value }) => {
        if (done) {
          if (onComplete) onComplete(fullText, currentModel);
          return;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (dataStr === "[DONE]") {
              if (onComplete) onComplete(fullText, currentModel);
              return;
            }
            if (dataStr) {
              try {
                const data = JSON.parse(dataStr);
                if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                  const textPart = data.candidates[0].content.parts[0].text;
                  fullText += textPart;
                  if (onChunk) onChunk(fullText);
                }
              } catch (e) {
                console.error("Error parsing streaming chunk", e);
              }
            }
          }
        }

        return reader.read().then(processText);
      };

      await reader.read().then(processText);
      return; // Successfully completed streaming!
    } catch (error) {
      console.warn(`[Gemini] Error with ${currentModel}: ${error.message}. Attempting fallback...`);
      lastError = error;
    }
  }

  // All models failed
  if (onError) onError(lastError || new Error("All Gemini models failed to respond."));
};
