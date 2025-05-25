
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MockDataService } from '@/services/mockData';
import { arrow-left, x } from 'lucide-react';

export default function StoreCart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (items.length === 0 || !user) return;

    try {
      const orderItems = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      }));

      await MockDataService.addOrder({
        memberId: user.id,
        memberName: user.name,
        storeId: user.storeId!,
        storeName: user.storeName!,
        items: orderItems,
        total: getTotalPrice(),
        status: 'pending'
      });

      clearCart();
      toast({
        title: 'Order placed successfully',
        description: 'Your order has been submitted for approval'
      });
      navigate('/store/orders');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to place order',
        variant: 'destructive'
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/store')}
          className="mb-6"
        >
          <arrow-left className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to get started</p>
          <Button onClick={() => navigate('/store')}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/store')}
        className="mb-6"
      >
        <arrow-left className="w-4 h-4 mr-2" />
        Continue Shopping
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          
          {items.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{item.product.category}</p>
                    <p className="text-lg font-bold text-green-600">${item.product.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <x className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full">
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full"
              >
                Clear Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
