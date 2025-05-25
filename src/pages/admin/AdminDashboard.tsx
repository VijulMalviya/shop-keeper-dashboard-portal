
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MockDataService, Store, Member, Order } from '@/services/mockData';

export default function AdminDashboard() {
  const [stores, setStores] = useState<Store[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [storesData, membersData, ordersData] = await Promise.all([
        MockDataService.getStores(),
        MockDataService.getMembers(),
        MockDataService.getOrders()
      ]);
      setStores(storesData);
      setMembers(membersData);
      setOrders(ordersData);
    };
    loadData();
  }, []);

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const totalRevenue = orders
    .filter(order => order.status === 'approved')
    .reduce((sum, order) => sum + order.total, 0);

  const stats = [
    {
      title: 'Total Stores',
      value: stores.length,
      description: 'Active store locations',
      color: 'bg-blue-500'
    },
    {
      title: 'Total Members',
      value: members.length,
      description: 'Registered store members',
      color: 'bg-green-500'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders.length,
      description: 'Orders awaiting approval',
      color: 'bg-yellow-500'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      description: 'From approved orders',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your store network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium">
                {stat.title}
              </CardDescription>
              <CardTitle className="text-2xl font-bold">
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
            <div className={`absolute top-0 right-0 w-1 h-full ${stat.color}`} />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from store members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{order.memberName}</p>
                    <p className="text-xs text-gray-500">{order.storeName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">${order.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Performance</CardTitle>
            <CardDescription>Member count by store location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stores.map((store) => (
                <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{store.name}</p>
                    <p className="text-xs text-gray-500">ID: {store.storeId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{store.memberCount} members</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
