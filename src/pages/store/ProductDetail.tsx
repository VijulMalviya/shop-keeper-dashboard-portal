
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MockDataService, Product } from '@/services/mockData';
import { useCart } from '@/contexts/CartContext';
import { arrow-left, shopping-cart } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    const products = await MockDataService.getProducts();
    const foundProduct = products.find(p => p.id === id);
    setProduct(foundProduct || null);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast({
      title: 'Added to cart',
      description: `${quantity} x ${product.name} added to your cart`
    });
    navigate('/store/cart');
  };

  if (!product) {
    return (
      <div className="px-4 py-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Product not found</p>
          <Button onClick={() => navigate('/store')} className="mt-4">
            Back to Products
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
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square relative overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-xl text-green-600 font-bold mt-2">${product.price}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{product.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add to Cart</CardTitle>
              <CardDescription>
                {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-24"
                />
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full"
              >
                <shopping-cart className="w-4 h-4 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
