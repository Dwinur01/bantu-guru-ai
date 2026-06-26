import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';
import { PaymentStatusResponse, PaymentHistoryResponse } from '../types/payment';

export interface CreatePaymentResponse {
  success: boolean;
  data: {
    snapToken: string;
    redirectUrl: string;
    orderId: string;
    plan: string;
    amount: number;
    subscriptionId: number;
  };
}

export class PaymentService {
  static async create(plan: string): Promise<CreatePaymentResponse['data']> {
    const res = await api.post<CreatePaymentResponse>(API_ENDPOINTS.PAYMENT.CREATE, { plan });
    return res.data.data;
  }

  static async status(orderId: string): Promise<PaymentStatusResponse> {
    const res = await api.get<{ success: boolean; data: PaymentStatusResponse }>(
      API_ENDPOINTS.PAYMENT.STATUS,
      { params: { order_id: orderId } }
    );
    return res.data.data;
  }

  static async history(params: { cursor?: string; take?: string }): Promise<PaymentHistoryResponse> {
    const res = await api.get<{ success: boolean; data: PaymentHistoryResponse }>(
      API_ENDPOINTS.PAYMENT.HISTORY,
      { params }
    );
    return res.data.data;
  }
}
