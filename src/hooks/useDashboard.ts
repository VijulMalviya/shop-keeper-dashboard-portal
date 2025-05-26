
import { useApiQuery } from './useApi';
import { MockDataService } from '@/services/mockData';

export const useDashboard = () => {
  const {
    data: stores = [],
    isLoading: isLoadingStores,
    error: storesError
  } = useApiQuery({
    queryKey: ['stores'],
    queryFn: MockDataService.getStores,
    staleTime: 2 * 60 * 1000,
  });

  const {
    data: members = [],
    isLoading: isLoadingMembers,
    error: membersError
  } = useApiQuery({
    queryKey: ['members'],
    queryFn: MockDataService.getMembers,
    staleTime: 2 * 60 * 1000,
  });

  const {
    data: orders = [],
    isLoading: isLoadingOrders,
    error: ordersError
  } = useApiQuery({
    queryKey: ['orders'],
    queryFn: MockDataService.getOrders,
    staleTime: 1 * 60 * 1000, // 1 minute for more frequent updates
  });

  const isLoading = isLoadingStores || isLoadingMembers || isLoadingOrders;
  const error = storesError || membersError || ordersError;

  return {
    stores,
    members,
    orders,
    isLoading,
    error,
  };
};
