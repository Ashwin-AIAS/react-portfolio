import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY 
});

// Embed job description text
export async function embedJobDescription(jobText) {
  const result = await client.models.embedContent({
    model: 'gemini-embedding-2-preview',
    contents: jobText,
  });
  return result.embeddings[0];
}

// Embed resume PDF bytes + job text together for cross-modal matching
export async function embedMultimodal(jobText, pdfBytes) {
  let binary = '';
  for (let i = 0; i < pdfBytes.length; i++) {
    binary += String.fromCharCode(pdfBytes[i]);
  }
  const base64String = btoa(binary);

  const result = await client.models.embedContent({
    model: 'gemini-embedding-2-preview',
    contents: [
      jobText,
      {
        inlineData: {
          data: base64String,
          mimeType: 'application/pdf',
        }
      }
    ],
  });
  return result.embeddings[0];
}

// Cosine similarity between two embedding vectors
export function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

// Generate the text report using Gemini 1.5 Flash
export async function generateFitReport(prompt) {
  const result = await client.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt,
    config: {
      maxOutputTokens: 1000,
    }
  });
  return result.text;
}
