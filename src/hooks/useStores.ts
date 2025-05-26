
import { useApiQuery, useApiMutation } from './useApi';
import { MockDataService, Store } from '@/services/mockData';

export const useStores = () => {
  const {
    data: stores = [],
    isLoading,
    error,
    refetch
  } = useApiQuery({
    queryKey: ['stores'],
    queryFn: MockDataService.getStores,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const addStoreMutation = useApiMutation({
    mutationFn: (storeData: Omit<Store, 'id'>) => MockDataService.addStore(storeData),
    invalidateQueries: [['stores']],
    onSuccess: () => {
      console.log('Store added successfully');
    }
  });

  const updateStoreMutation = useApiMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Store> }) => 
      MockDataService.updateStore(id, data),
    invalidateQueries: [['stores']],
    onSuccess: () => {
      console.log('Store updated successfully');
    }
  });

  const deleteStoreMutation = useApiMutation({
    mutationFn: (id: string) => MockDataService.deleteStore(id),
    invalidateQueries: [['stores']],
    onSuccess: () => {
      console.log('Store deleted successfully');
    }
  });

  return {
    stores,
    isLoading,
    error,
    refetch,
    addStore: addStoreMutation.mutate,
    updateStore: (id: string, data: Partial<Store>) => 
      updateStoreMutation.mutate({ id, data }),
    deleteStore: deleteStoreMutation.mutate,
    isAddingStore: addStoreMutation.isPending,
    isUpdatingStore: updateStoreMutation.isPending,
    isDeletingStore: deleteStoreMutation.isPending,
  };
};
