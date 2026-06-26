import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';
import { User } from '../types/auth';

export interface UserProfileResponse {
  success: boolean;
  data: User & {
    quotaPercentage: number;
    showUpgradeBanner: boolean;
    emailVerified: boolean;
    createdAt: string;
    activeSubscription: {
      plan: string;
      status: string;
      expiresAt: string | null;
    } | null;
  };
}

export class UserService {
  static async getProfile(): Promise<UserProfileResponse['data']> {
    const res = await api.get<UserProfileResponse>(API_ENDPOINTS.USER.PROFILE);
    return res.data.data;
  }

  static async updateProfile(name: string): Promise<User> {
    const res = await api.patch<{ success: boolean; data: User }>(API_ENDPOINTS.USER.PROFILE, {
      name,
    });
    return res.data.data;
  }

  static async deleteAccount(): Promise<void> {
    await api.delete(API_ENDPOINTS.USER.PROFILE);
  }
}
