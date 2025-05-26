
import { useApiQuery, useApiMutation } from './useApi';
import { MockDataService, Member, Store } from '@/services/mockData';

export const useMembers = () => {
  const {
    data: members = [],
    isLoading: isLoadingMembers,
    error: membersError,
    refetch: refetchMembers
  } = useApiQuery({
    queryKey: ['members'],
    queryFn: MockDataService.getMembers,
    staleTime: 2 * 60 * 1000,
  });

  const {
    data: stores = [],
    isLoading: isLoadingStores,
    error: storesError
  } = useApiQuery({
    queryKey: ['stores'],
    queryFn: MockDataService.getStores,
    staleTime: 5 * 60 * 1000,
  });

  const addMemberMutation = useApiMutation({
    mutationFn: (memberData: Omit<Member, 'id' | 'createdAt'>) => 
      MockDataService.addMember(memberData),
    invalidateQueries: [['members']],
    onSuccess: () => {
      console.log('Member added successfully');
    }
  });

  const updateMemberMutation = useApiMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Member> }) => 
      MockDataService.updateMember(id, data),
    invalidateQueries: [['members']],
    onSuccess: () => {
      console.log('Member updated successfully');
    }
  });

  const deleteMemberMutation = useApiMutation({
    mutationFn: (id: string) => MockDataService.deleteMember(id),
    invalidateQueries: [['members']],
    onSuccess: () => {
      console.log('Member deleted successfully');
    }
  });

  return {
    members,
    stores,
    isLoading: isLoadingMembers || isLoadingStores,
    error: membersError || storesError,
    refetch: refetchMembers,
    addMember: addMemberMutation.mutate,
    updateMember: (id: string, data: Partial<Member>) => 
      updateMemberMutation.mutate({ id, data }),
    deleteMember: deleteMemberMutation.mutate,
    isAddingMember: addMemberMutation.isPending,
    isUpdatingMember: updateMemberMutation.isPending,
    isDeletingMember: deleteMemberMutation.isPending,
  };
};
