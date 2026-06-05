import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Wajib agar cookie refresh token terkirim otomatis
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Otomatis sematkan Access Token JWT dari Zustand
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // MOCK ADAPTER UNTUK DEMO ACCOUNTS
    if (token === 'mock-demo-jwt-token-from-json') {
      config.adapter = async (cfg) => {
        let responseData: any = { success: true, data: {} };
        const url = cfg.url || '';

        if (url.includes('/user/me')) {
          responseData = {
            success: true,
            data: {
              id: 999,
              name: "Guru Honor Demo",
              email: "guru.demo@gurubantu.ai",
              plan: "pro",
              quotaRemaining: 100,
              quotaPercentage: 100,
              documentsCreated: 12
            }
          };
        } else if (url.includes('/documents/generate')) {
          let docType = 'rpp';
          try {
            if (cfg.data) {
              const body = typeof cfg.data === 'string' ? JSON.parse(cfg.data) : cfg.data;
              docType = body.type || 'rpp';
            }
          } catch (e) {}
          
          responseData = {
            success: true,
            data: {
              id: 101,
              title: "Dokumen Pembelajaran - Hasil Demo",
              type: docType,
              gcsPath: "#"
            }
          };
        } else if (url.includes('/documents')) {
          responseData = {
            success: true,
            data: [
              {
                id: 101,
                title: "RPP Bahasa Indonesia Kelas VII",
                type: "rpp",
                created_at: new Date().toISOString(),
                is_public: false
              },
              {
                id: 102,
                title: "Modul Ajar Matematika Fase D",
                type: "modul-ajar",
                created_at: new Date(Date.now() - 86400000).toISOString(),
                is_public: true
              }
            ]
          };
        }

        return {
          data: responseData,
          status: 200,
          statusText: 'OK',
          headers: cfg.headers as any,
          config: cfg,
        };
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Tangani 401 dan lakukan auto-refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error status 401 dan request belum pernah di-retry
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Jika sedang melakukan refresh token di request lain, antre request ini
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Panggil endpoint refresh token di backend
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        
        // Simpan token baru ke Zustand store
        useAuthStore.getState().setAccessToken(accessToken);

        // Proses antrean request yang tertunda
        processQueue(null, accessToken);
        isRefreshing = false;

        // Jalankan kembali request awal dengan token yang baru
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Jika refresh token gagal, paksa logout user
        processQueue(refreshError, null);
        isRefreshing = false;
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
