import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';
import { LoginCredentials, RegisterData, User } from '../types/auth';

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: User;
  };
}

export interface GoogleLoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: User;
    isNewUser: boolean;
  };
}

export class AuthService {
  static async register(data: RegisterData): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  static async login(credentials: LoginCredentials): Promise<LoginResponse['data']> {
    const res = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return res.data.data;
  }

  static async googleLogin(idToken: string): Promise<GoogleLoginResponse['data']> {
    const res = await api.post<GoogleLoginResponse>(API_ENDPOINTS.AUTH.GOOGLE, { idToken });
    return res.data.data;
  }

  static async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  static async refresh(): Promise<string> {
    const res = await api.post<{ success: boolean; data: { accessToken: string } }>(
      API_ENDPOINTS.AUTH.REFRESH
    );
    return res.data.data.accessToken;
  }
}
