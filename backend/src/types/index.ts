// Shared TypeScript types untuk seluruh backend GuruBantu AI

export type DocumentType = 'rpp' | 'soal' | 'modul_ajar';

export type UserPlan = 'free' | 'saset' | 'basic' | 'pro';

export interface JwtPayload {
  userId: string;
  email: string;
  plan: UserPlan;
}

export interface GenerateInput {
  type: DocumentType;
  inputData: Record<string, unknown>;
}
