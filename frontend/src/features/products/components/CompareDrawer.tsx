import { useState } from 'react';
import { X, Scale, Star, ShoppingCart } from 'lucide-react';
import { Button } from '../../../components/button';
import { Badge } from '../../../components/badge';
import { useCompare } from '../CompareContext';
import { useCart } from '../../cart/CartContext';
import { useToast } from '../../../hooks/useToast';

const CompareDrawer = () => {
  const { compareProducts, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  if (compareProducts.length === 0) return null;

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product._id || product.id,
      quantity: 1
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const getBrandColor = (brand: string) => {
    const colors: { [key: string]: string } = {
      'Nike': 'bg-orange-100 text-orange-800',
      'Adidas': 'bg-blue-100 text-blue-800',
      'Puma': 'bg-yellow-100 text-yellow-800',
      'Vans': 'bg-red-100 text-red-800',
      'Converse': 'bg-purple-100 text-purple-800',
      'New Balance': 'bg-green-100 text-green-800',
      'Sherpa': 'bg-teal-100 text-teal-800',
      'Himalayan': 'bg-indigo-100 text-indigo-800',
      'Mustang': 'bg-rose-100 text-rose-800',
    };
    return colors[brand] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      {/* Floating Compare Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 shadow-lg"
        >
          <Scale className="h-4 w-4 mr-2" />
          Compare ({compareProducts.length})
        </Button>
      </div>

      {/* Compare Drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-t-lg overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center">
                <Scale className="h-5 w-5 mr-2" />
                Compare Products ({compareProducts.length}/3)
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearCompare}>
                  Clear All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {compareProducts.map((product) => (
                  <div key={product._id} className="border rounded-lg p-4 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCompare(product._id)}
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <Badge className={getBrandColor(product.brand)}>
                          {product.brand}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-semibold text-lg">${product.price}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span>{product.category}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating:</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1">{product.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stock:</span>
                          <span>{product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                          {product.description}
                        </p>
                        
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompareDrawer;
