export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    GOOGLE: '/auth/google',
  },
  USER: {
    PROFILE: '/user/me',
  },
  DOCUMENTS: {
    GENERATE: '/documents/generate',
    LIST: '/documents',
    DOWNLOAD: (id: string | number) => `/documents/${id}/download`,
    SHARE: (id: string | number) => `/documents/${id}/share`,
    DELETE: (id: string | number) => `/documents/${id}`,
  },
  LIBRARY: {
    LIST: '/library',
  },
  PAYMENT: {
    CREATE: '/payment/create',
    STATUS: '/payment/status',
    HISTORY: '/payment/history',
    WEBHOOK: '/payment/webhook',
  },
} as const;
