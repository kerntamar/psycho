import { GoogleGenerativeAI } from "@google/generative-ai";

const isClient = typeof window !== 'undefined';
const apiKey = (isClient ? localStorage.getItem('NEXT_PUBLIC_GEMINI_API_KEY') : null) || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "placeholder-key";

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateContent(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function extractFromPDF(pdfBase64: string, prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: pdfBase64,
        mimeType: "application/pdf",
      },
    },
  ]);
  const response = await result.response;
  return response.text();
}
