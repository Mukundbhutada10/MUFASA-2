import { GoogleGenAI, Chat } from "@google/genai";
import { COMPANY_INFO } from '../constants';

// Safely access the API key in a way that works in both Node.js and browser environments.
// This prevents a "process is not defined" error in the browser.
const API_KEY = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;


if (!API_KEY) {
  // In a real app, you might show a user-friendly message or disable chat functionality.
  // For this example, we'll log an error to the console.
  console.error("Gemini API key not found. Chat functionality will be disabled.");
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
