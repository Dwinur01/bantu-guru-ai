export type UserPlan = 'free' | 'saset' | 'basic' | 'pro';

export interface SubscriptionItem {
  id: number;
  plan: UserPlan;
  status: 'pending' | 'active' | 'capture' | 'settlement' | 'deny' | 'expire' | 'cancel' | string;
  amount: number;
  midtrans_order_id: string;
  started_at: string | null;
  expires_at: string | null;
}

export interface PaymentStatusResponse {
  id: number;
  plan: UserPlan;
  status: string;
  amount: number;
  started_at: string | null;
  expires_at: string | null;
  user_id: number;
}

export interface PaymentHistoryResponse {
  items: SubscriptionItem[];
  nextCursor: string | null;
  hasMore: boolean;
}
