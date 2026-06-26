import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;
export let genAI: GoogleGenerativeAI | null = null;
export let useMockFallback = true;

if (API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    useMockFallback = false;
    console.log('[Gemini] Gemini API Client initialized successfully.');
  } catch (error) {
    console.error('[Gemini] Failed to initialize Gemini API client:', error);
  }
} else {
  console.log('[Gemini] GEMINI_API_KEY missing. Using Mock Fallback.');
}

export const runWithTimeout = <T>(fn: () => Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI_TIMEOUT')), ms)
    ),
  ]);
};
