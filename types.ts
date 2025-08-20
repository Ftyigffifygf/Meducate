import type { Chat } from "@google/genai";

export enum Specialty {
  MBBS = 'MBBS',
  AYURVEDA = 'Ayurveda',
  YOGA = 'Yoga & Naturopathy',
  UNANI = 'Unani',
  SIDDHA = 'Siddha',
  HOMEOPATHY = 'Homeopathy',
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  imageUrl?: string;
}

export interface ChatInstance {
  specialty: Specialty;
  chat: Chat;
}
