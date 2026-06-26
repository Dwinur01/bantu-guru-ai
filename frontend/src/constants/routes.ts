export const ROUTES = {
  LANDING: '/',
  ABOUT: '/about',
  LEARN_MORE: '/learn-more',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  GENERATE_RPP: '/generate/rpp',
  GENERATE_SOAL: '/generate/soal',
  GENERATE_MODUL_AJAR: '/generate/modul-ajar',
  GENERATE_SUCCESS: '/generate/success',
  DOCUMENTS: '/documents',
  LIBRARY: '/library',
  PROFILE: '/profile',
  PRICING: '/pricing',
  BILLING: '/billing',
  PAYMENT: '/payment',
} as const;

export type RouteType = typeof ROUTES[keyof typeof ROUTES];
