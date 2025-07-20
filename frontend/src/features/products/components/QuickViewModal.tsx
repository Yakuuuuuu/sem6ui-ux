import { useState, useEffect, useRef } from 'react';
import { X, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../../cart/CartContext';
import { useToast } from '../../../hooks/useToast';
import { Product } from './ProductContext';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  intent?: 'quickview' | 'addtocart';
}

const QuickViewModal = ({ product, isOpen, onClose, intent = 'quickview' }: QuickViewModalProps) => {
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useCart();
  const { toast } = useToast();
  const sizeSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && intent === 'addtocart' && sizeSectionRef.current) {
      sizeSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isOpen, intent]);

  useEffect(() => {
    if (intent === 'addtocart' && selectedSize) {
      handleAddToCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSize]);

  if (!isOpen || !product) return null;

  const sizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      productId: String(product._id || product.id),
      size: selectedSize
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });

    onClose();
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Quick View</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close quick view"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <h3 className="text-2xl font-bold text-black mb-4">{product.name}</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-500">({product.rating})</span>
                </div>
                <p className="text-2xl font-bold text-black">${product.price}</p>
              </div>

              {/* Size Selection */}
              <div ref={sizeSectionRef}>
                <h4 className="text-sm font-semibold mb-3">Size</h4>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 border rounded text-center font-medium ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
