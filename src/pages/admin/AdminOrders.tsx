import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useOrders } from '@/hooks/useOrders';
import { usePagination } from '@/hooks/usePagination';
import { OrdersTableSkeleton } from '@/components/OrdersTableSkeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Loading, LoadingSpinner } from '@/components/ui/loading';
import { Check, X, Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';

function AdminOrdersContent() {
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

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedOrders,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    totalItems
  } = usePagination({
    data: filteredOrders,
    itemsPerPage: 10
  });

  console.log('AdminOrders render:', { 
    ordersCount: filteredOrders.length, 
    paginatedCount: paginatedOrders.length,
    currentPage,
    totalPages,
    isLoading, 
    error,
    searchTerm,
    statusFilter 
  });

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
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleApprove = async (orderId: string) => {
    try {
      await approveOrder(orderId);
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  const handleReject = async (orderId: string) => {
    try {
      await rejectOrder(orderId);
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };

  if (isLoading && filteredOrders.length === 0) {
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
          {isLoading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
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
                  onChange={(e) => {
                    console.log('Search term changed:', e.target.value);
                    setSearchTerm(e.target.value);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => {
                  console.log('Status filter changed:', value);
                  setStatusFilter(value);
                }}
              >
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base md:text-lg">
                Orders ({totalItems})
              </CardTitle>
              <CardDescription className="text-sm">
                {totalItems === 0 && (searchTerm || statusFilter !== 'all')
                  ? 'No orders match your search criteria'
                  : `Showing ${startIndex + 1}-${endIndex} of ${totalItems} orders`}
              </CardDescription>
            </div>
            {isLoading && filteredOrders.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoadingSpinner size="sm" />
                Updating...
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile Card View */}
          <div className="block md:hidden">
            {paginatedOrders.length === 0 ? (
              <div className="text-center py-8 px-4">
                <p className="text-gray-500 text-sm">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No orders match your search criteria' 
                    : 'No orders found'}
                </p>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {paginatedOrders.map((order) => (
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
                              onClick={() => handleApprove(order.id)}
                              className="bg-green-600 hover:bg-green-700 text-white flex-1 text-xs"
                              disabled={isLoading}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(order.id)}
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
                {paginatedOrders.map((order) => (
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
                            onClick={() => handleApprove(order.id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                            disabled={isLoading}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(order.id)}
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

            {paginatedOrders.length === 0 && (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={goToPreviousPage}
                    className={!canGoPrevious ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                  if (pageNumber <= totalPages) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => goToPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={goToNextPage}
                    className={!canGoNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function AdminOrders() {
  return (
    <ErrorBoundary>
      <AdminOrdersContent />
    </ErrorBoundary>
  );
}
