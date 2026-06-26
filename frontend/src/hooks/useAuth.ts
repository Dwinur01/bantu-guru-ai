import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { AuthService } from '../services/authService';
import { LoginCredentials, RegisterData } from '../types/auth';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setLoading = useAuthStore((state) => state.setLoading);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      try {
        const data = await AuthService.login(credentials);
        setAuth(data.user, data.accessToken);
        return data;
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setLoading]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      setLoading(true);
      try {
        await AuthService.register(data);
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const googleLogin = useCallback(
    async (idToken: string) => {
      setLoading(true);
      try {
        const data = await AuthService.googleLogin(idToken);
        setAuth(data.user, data.accessToken);
        return data;
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setLoading]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await AuthService.logout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      clearAuth();
    }
  }, [clearAuth, setLoading]);

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    register,
    googleLogin,
    logout,
  };
}
