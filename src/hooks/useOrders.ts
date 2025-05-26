
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Order } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';

// Mock API endpoints
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

interface UseOrdersReturn {
  orders: Order[];
  filteredOrders: Order[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: string;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  approveOrder: (orderId: string) => Promise<void>;
  rejectOrder: (orderId: string) => Promise<void>;
  refreshOrders: () => void;
}

export const useOrders = (): UseOrdersReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data generator
  const generateMockOrders = (): Order[] => {
    const statuses: Array<'pending' | 'approved' | 'rejected'> = ['pending', 'approved', 'rejected'];
    const stores = ['Downtown Store', 'Mall Location', 'Airport Branch', 'Suburban Center'];
    const members = ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emma Brown', 'David Lee'];
    
    return Array.from({ length: 15 }, (_, index) => ({
      id: `order-${index + 1}`,
      memberId: `member-${(index % 5) + 1}`,
      memberName: members[index % members.length],
      storeId: `store-${(index % 4) + 1}`,
      storeName: stores[index % stores.length],
      items: [
        {
          productId: `product-${index + 1}`,
          productName: `Product ${index + 1}`,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: Math.floor(Math.random() * 100) + 20
        }
      ],
      total: Math.floor(Math.random() * 300) + 50,
      status: statuses[index % statuses.length],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  // Fetch orders with React Query
  const {
    data: orders = [],
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      console.log('Fetching orders...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be:
      // const response = await axios.get(`${API_BASE_URL}/orders`);
      // return response.data;
      
      console.log('Orders fetched successfully');
      return generateMockOrders();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || (
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.storeName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Approve order mutation
  const approveOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      console.log(`Approving order ${orderId}...`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // await axios.patch(`${API_BASE_URL}/orders/${orderId}`, { status: 'approved' });
      
      console.log(`Order ${orderId} approved successfully`);
      return orderId;
    },
    onSuccess: (orderId) => {
      // Optimistically update the cache
      queryClient.setQueryData(['orders'], (oldOrders: Order[] = []) =>
        oldOrders.map(order =>
          order.id === orderId ? { ...order, status: 'approved' as const } : order
        )
      );

      toast({
        title: 'Success',
        description: 'Order approved successfully'
      });
    },
    onError: (error) => {
      console.error('Error approving order:', error);
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || error.message 
        : 'Failed to approve order';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  });

  // Reject order mutation
  const rejectOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      console.log(`Rejecting order ${orderId}...`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // await axios.patch(`${API_BASE_URL}/orders/${orderId}`, { status: 'rejected' });
      
      console.log(`Order ${orderId} rejected successfully`);
      return orderId;
    },
    onSuccess: (orderId) => {
      // Optimistically update the cache
      queryClient.setQueryData(['orders'], (oldOrders: Order[] = []) =>
        oldOrders.map(order =>
          order.id === orderId ? { ...order, status: 'rejected' as const } : order
        )
      );

      toast({
        title: 'Order Rejected',
        description: 'Order has been rejected'
      });
    },
    onError: (error) => {
      console.error('Error rejecting order:', error);
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || error.message 
        : 'Failed to reject order';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  });

  const error = queryError ? 
    (axios.isAxiosError(queryError) 
      ? queryError.response?.data?.message || queryError.message 
      : 'Failed to fetch orders') 
    : null;

  const approveOrder = async (orderId: string) => {
    await approveOrderMutation.mutateAsync(orderId);
  };

  const rejectOrder = async (orderId: string) => {
    await rejectOrderMutation.mutateAsync(orderId);
  };

  const refreshOrders = () => {
    console.log('Refreshing orders...');
    refetch();
  };

  return {
    orders,
    filteredOrders,
    isLoading: isLoading || approveOrderMutation.isPending || rejectOrderMutation.isPending,
    error,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    approveOrder,
    rejectOrder,
    refreshOrders
  };
};
