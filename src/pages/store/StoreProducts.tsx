import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MockDataService, Product } from '@/services/mockData';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function StoreProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem, getTotalItems } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const productsData = await MockDataService.getProducts();
    setProducts(productsData);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`
    });
  };

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Browse our product catalog</p>
        </div>
        <Link to="/store/cart">
          <Button variant="outline" className="relative">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
            {getTotalItems() > 0 && (
              <Badge className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {getTotalItems()}
              </Badge>
            )}
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow overflow-hidden">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-2 right-2 bg-white text-gray-900">
                {product.category}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">${product.price}</p>
                  <p className="text-sm text-gray-500">{product.stock} in stock</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/store/product/${product.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available</p>
        </div>
      )}
    </div>
  );
}
