export interface User {
  id: string | number;
  name: string;
  email: string;
  plan: 'free' | 'saset' | 'basic' | 'pro' | 'kkg';
  quota_remaining?: number;
  quotaRemaining?: number;
  quotaPercentage?: number;
  showUpgradeBanner?: boolean;
  quota_reset_at?: string;
  created_at?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
}
