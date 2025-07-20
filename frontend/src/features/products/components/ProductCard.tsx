import { useState } from 'react';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { useCart } from '../../cart/CartContext';
import { useToast } from '../../../hooks/useToast';
import CompareButton from './CompareButton';
import { useWishlist } from '../../wishlist/WishlistContext';
import { Product } from './ProductContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product, intent?: 'quickview' | 'addtocart') => void;
  onNavigate?: () => void;
}

const ProductCard = ({ product, onQuickView, onNavigate }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onQuickView) {
      onQuickView(product, 'addtocart');
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    onQuickView?.(product, 'quickview');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAddToCart(e as any);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    let id = product._id || product.id;
    if (!id) {
      id = Math.random().toString(36).substr(2, 9); // fallback random id
    }
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      const item = {
        id: id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating
      };
      console.log('Adding to wishlist:', item);
      addToWishlist(item);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400" aria-hidden="true">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400" aria-hidden="true">★</span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300" aria-hidden="true">★</span>
      );
    }

    return stars;
  };

  return (
    <article
      className="group cursor-pointer bg-white rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 focus-within:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-labelledby={`product-${product.id}-name`}
      onClick={e => {
        // Prevent navigation if clicking on action buttons
        if (
          (e.target as HTMLElement).closest('button') ||
          (e.target as HTMLElement).closest('svg')
        ) {
          return;
        }
        onNavigate?.();
      }}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={`${product.name} - ${product.category}`}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10"
          aria-label={isInWishlist(product._id || product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`h-5 w-5 ${isInWishlist(product._id || product.id) ? 'fill-current text-red-500' : 'text-gray-400'}`} />
        </button>
        <div 
          className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center space-x-3 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={!isHovered}
        >
          <button
            onClick={handleQuickView}
            className="bg-white text-black px-4 py-2 rounded-full font-semibold flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            <span>Quick View</span>
          </button>
          <button
            onClick={handleAddToCart}
            onKeyDown={handleKeyDown}
            disabled={isAddingToCart}
            className="bg-white text-black px-4 py-2 rounded-full font-semibold flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
            aria-label={`Add ${product.name} to cart for $${product.price}`}
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">{product.category}</div>
        <h3 id={`product-${product.id}-name`} className="font-semibold text-lg text-gray-900 mb-2">
          {product.name}
        </h3>
        <div className="flex items-center mb-2" role="img" aria-label={`Rating: ${product.rating} out of 5 stars`}>
          {renderStars(product.rating || 0)}
          <span className="ml-2 text-sm text-gray-600">({product.rating || 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900" aria-label={`Price: $${product.price}`}>
            ${product.price}
          </span>
          <CompareButton product={product} variant="default" />
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
