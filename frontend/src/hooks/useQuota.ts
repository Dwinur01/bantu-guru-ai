import { useState, useCallback } from 'react';
import { UserService } from '../services/userService';
import { useAuthStore } from '../store/authStore';

export function useQuota() {
  const [loading, setLoading] = useState(false);
  const [quotaRemaining, setQuotaRemaining] = useState<number>(5);
  const [quotaPercentage, setQuotaPercentage] = useState<number>(100);
  const [plan, setPlan] = useState<string>('free');
  const [showUpgradeBanner, setShowUpgradeBanner] = useState<boolean>(false);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const refreshQuota = useCallback(async () => {
    setLoading(true);
    try {
      const data = await UserService.getProfile();
      setQuotaRemaining(data.quotaRemaining ?? 0);
      setQuotaPercentage(data.quotaPercentage ?? 0);
      setPlan(data.plan);
      setShowUpgradeBanner(data.showUpgradeBanner);
      setActiveSubscription(data.activeSubscription);

      // Sync user data to authStore if changed
      if (user && accessToken && (user.quotaRemaining !== data.quotaRemaining || user.plan !== data.plan)) {
        setAuth(
          {
            ...user,
            plan: data.plan,
            quotaRemaining: data.quotaRemaining,
          },
          accessToken
        );
      }

      return data;
    } catch (err) {
      console.error('Failed to refresh quota:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, accessToken, setAuth]);

  return {
    quotaRemaining,
    quotaPercentage,
    plan,
    showUpgradeBanner,
    activeSubscription,
    loading,
    refreshQuota,
  };
}
