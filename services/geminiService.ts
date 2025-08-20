import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Specialty } from '../types';
import { SYSTEM_INSTRUCTIONS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper function to convert File to a Gemini-compatible Part
async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string; } }> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}


export function createChatSession(specialty: Specialty): Chat {
  const chat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS[specialty],
    }
  });
  return chat;
}

export async function sendMessageStreamToAI(
  chat: Chat, 
  message: string, 
  imageFile?: File
): Promise<AsyncGenerator<GenerateContentResponse>> {
  try {
    let contentForApi: (string | { inlineData: { data: string; mimeType: string; } })[] = [message];
    if (imageFile) {
      const imagePart = await fileToGenerativePart(imageFile);
      // Gemini works best with image first, then text
      contentForApi = [imagePart, message];
    }
    
    return chat.sendMessageStream({ message: contentForApi });

  } catch (error) {
    console.error("Error sending message to Gemini API:", error);
    throw error;
  }
}