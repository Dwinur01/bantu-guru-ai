import { z } from 'zod';

export const createPaymentSchema = z.object({
  plan: z.enum(['saset', 'basic', 'pro'], {
    required_error: 'Paket langganan wajib diisi',
    invalid_type_error: 'Paket langganan tidak valid. Pilih: saset, basic, atau pro',
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
