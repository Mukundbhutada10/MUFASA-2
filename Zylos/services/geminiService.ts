import { GoogleGenAI, Chat } from "@google/genai";
import { COMPANY_INFO } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might show a user-friendly message or disable chat functionality.
  // For this example, we'll throw an error during development.
  console.error("API_KEY environment variable not set. Chat functionality will be disabled.");
}

// We create the AI instance but will only proceed if the API key is present.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

let chat: Chat | null = null;

export function getChatSession(): Chat | null {
  if (!ai) {
    return null;
  }

  if (chat) {
    return chat;
  }

  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: COMPANY_INFO,
    },
  });

  return chat;
}
