
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Order } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';

// Mock API endpoints
const API_BASE_URL = 'https://jsonplaceholder.typicode.com'; // Using JSONPlaceholder for demo

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
  refreshOrders: () => Promise<void>;
}

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

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

  // Simulate API call with axios
  const fetchOrders = async (): Promise<Order[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be:
      // const response = await axios.get(`${API_BASE_URL}/orders`);
      // return response.data;
      
      // For demo, return mock data
      return generateMockOrders();
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'Failed to fetch orders';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Filter orders based on search term and status
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.storeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const fetchedOrders = await fetchOrders();
    setOrders(fetchedOrders);
  };

  const approveOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // await axios.patch(`${API_BASE_URL}/orders/${orderId}`, { status: 'approved' });
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'approved' as const } : order
      ));
      
      toast({
        title: 'Success',
        description: 'Order approved successfully'
      });
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'Failed to approve order';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const rejectOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // await axios.patch(`${API_BASE_URL}/orders/${orderId}`, { status: 'rejected' });
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'rejected' as const } : order
      ));
      
      toast({
        title: 'Order Rejected',
        description: 'Order has been rejected'
      });
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'Failed to reject order';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOrders = async () => {
    await loadOrders();
  };

  return {
    orders,
    filteredOrders,
    isLoading,
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
