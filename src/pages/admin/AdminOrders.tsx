
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MockDataService, Order } from '@/services/mockData';
import { Check, X, Clock, DollarSign, Package, AlertCircle } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await MockDataService.getOrders();
    setOrders(data);
  };

  const handleApproveOrder = async (orderId: string) => {
    try {
      await MockDataService.updateOrderStatus(orderId, 'approved');
      toast({ title: 'Order approved successfully' });
      loadOrders();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve order', variant: 'destructive' });
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      await MockDataService.updateOrderStatus(orderId, 'rejected');
      toast({ title: 'Order rejected' });
      loadOrders();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject order', variant: 'destructive' });
    }
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const approvedOrders = orders.filter(order => order.status === 'approved');
  const rejectedOrders = orders.filter(order => order.status === 'rejected');

  return (
    <div className="px-4 py-6 bg-gradient-to-br from-orange-50 to-red-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Order Management
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Review and manage customer orders</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Orders</p>
                <p className="text-2xl font-bold text-gray-900">{approvedOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected Orders</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {order.memberName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {order.memberName}
                      <Badge variant={
                        order.status === 'pending' ? 'secondary' :
                        order.status === 'approved' ? 'default' : 'destructive'
                      } className={
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {order.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {order.status === 'approved' && <Check className="w-3 h-3 mr-1" />}
                        {order.status === 'rejected' && <X className="w-3 h-3 mr-1" />}
                        {order.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span>From: {order.storeName}</span>
                      <span>•</span>
                      <span>Order #{order.id.slice(-6)}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
                    <DollarSign className="w-5 h-5" />
                    {order.total.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-500">{order.items.length} items</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Package className="w-4 h-4 text-gray-600" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity} × ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {order.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => handleApproveOrder(order.id)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve Order
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectOrder(order.id)}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject Order
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-xl text-gray-500 mb-2">No orders found</p>
          <p className="text-gray-400">Orders will appear here when customers place them</p>
        </div>
      )}
    </div>
  );
}
