// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

// gemini.ts

import {
  GoogleGenAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/genai';

// Initialize Gemini AI with your API key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!, // Make sure to set this in .env.local or environment variables
});

// Define the model
const model = 'gemini-1.5-flash';

// Define the function to get Gemini response
export async function getGeminiResponse(prompt: string): Promise<string> {
  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const config = {
    responseMimeType: 'text/plain',
    // thinkingConfig: {
    //   thinkingBudget: -1, // Optional: remove limit on "thinking time"
    // },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  };

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullResponse = '';

    for await (const chunk of response) {
      if (chunk.text) {
        fullResponse += chunk.text;
      }
    }

    return fullResponse.trim();
  } catch (error) {
    console.error('[GEMINI_ERROR]', error);
    throw new Error('Failed to get response from Gemini');
  }
}
