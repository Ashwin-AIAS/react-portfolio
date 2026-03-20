export const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY;
};

// ... keep existing embed functionality untouched if anything relies on it
export const generateEmbeddings = async (text) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API key is missing.");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: "models/text-embedding-004",
      content: { parts: [{ text: text }] }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.embedding.values;
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
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// --- NEW STREAMING FUNCTION ---
export const streamGeminiResponse = async (messages, onChunk, onComplete, onError) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    onError(new Error("API key is missing."));
    return;
  }

  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: formattedMessages
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API streaming error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";

    const processText = async ({ done, value }) => {
      if (done) {
        onComplete(fullText);
        return;
      }
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.replace("data: ", "").trim();
          if (dataStr === "[DONE]") {
            onComplete(fullText);
            return;
          }
          if (dataStr) {
            try {
              const data = JSON.parse(dataStr);
              if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
                const textPart = data.candidates[0].content.parts[0].text;
                fullText += textPart;
                onChunk(fullText);
              }
            } catch (e) {
              console.error("Error parsing streaming chunk", e);
            }
          }
        }
      }
      
      return reader.read().then(processText);
    };

    reader.read().then(processText);

  } catch (error) {
    onError(error);
  }
};
