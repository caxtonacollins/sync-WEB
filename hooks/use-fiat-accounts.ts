import { useAuth } from '@/contexts/AuthContext';

export function useFiatAccounts() {
  const { getFiatAccounts } = useAuth();
  return {
    data: getFiatAccounts(),
    isLoading: false 
  };
}
