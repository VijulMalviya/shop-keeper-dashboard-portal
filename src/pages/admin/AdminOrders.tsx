
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOrders } from '@/hooks/useOrders';
import { OrdersTableSkeleton } from '@/components/OrdersTableSkeleton';
import { Check, X, Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminOrders() {
  const {
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
  } = useOrders();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800 text-xs">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 text-xs">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Review and manage customer orders</p>
        </div>
        <OrdersTableSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Review and manage customer orders</p>
        </div>
        <Button
          onClick={refreshOrders}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filter Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Filter className="w-4 h-4 md:w-5 md:h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by order number, member, or store..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base md:text-lg">Orders ({filteredOrders.length})</CardTitle>
          <CardDescription className="text-sm">
            {filteredOrders.length === 0 && (searchTerm || statusFilter !== 'all')
              ? 'No orders match your search criteria'
              : `Showing ${filteredOrders.length} orders`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile Card View */}
          <div className="block md:hidden">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 px-4">
                <p className="text-gray-500 text-sm">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No orders match your search criteria' 
                    : 'No orders found'}
                </p>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">#{order.id.slice(-6)}</p>
                            <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs">
                              {order.memberName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium">{order.memberName}</span>
                          </div>
                          <p className="text-xs text-gray-600">{order.storeName}</p>
                          <p className="text-xs text-gray-600">{order.items.length} items</p>
                          <p className="text-sm font-semibold">${order.total.toFixed(2)}</p>
                        </div>

                        {order.status === 'pending' && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => approveOrder(order.id)}
                              className="bg-green-600 hover:bg-green-700 text-white flex-1 text-xs"
                              disabled={isLoading}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectOrder(order.id)}
                              className="flex-1 text-xs"
                              disabled={isLoading}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Order #</TableHead>
                  <TableHead className="text-xs">Member</TableHead>
                  <TableHead className="text-xs">Store</TableHead>
                  <TableHead className="text-xs">Items</TableHead>
                  <TableHead className="text-xs">Total</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-sm">
                      #{order.id.slice(-6)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs">
                          {order.memberName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm">{order.memberName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{order.storeName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{order.items.length} items</span>
                        <div className="text-xs text-gray-500">
                          {order.items.slice(0, 1).map((item, index) => (
                            <div key={index}>{item.productName}</div>
                          ))}
                          {order.items.length > 1 && (
                            <div>+{order.items.length - 1} more</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      {order.status === 'pending' ? (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => approveOrder(order.id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                            disabled={isLoading}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejectOrder(order.id)}
                            className="text-xs px-2 py-1"
                            disabled={isLoading}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">No actions</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No orders match your search criteria' 
                    : 'No orders found'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
