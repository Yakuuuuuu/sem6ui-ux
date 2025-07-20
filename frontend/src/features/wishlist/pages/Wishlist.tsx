import { useState } from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Cart from '../../cart/components/Cart';
import { useCart } from '../../cart/CartContext';
import { useWishlist } from '../WishlistContext';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist, addToWishlist } = useWishlist();
  console.log('Wishlist page items:', wishlist);

  const handleAddToBag = (item: any) => {
    addToCart({
      productId: item._id || item.id,
      size: '9', // Default size
      color: 'Default'
    });
    setIsCartOpen(true);
  };

  const handleClearAll = () => {
    wishlist.forEach(item => removeFromWishlist(item.id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => setIsCartOpen(true)} />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="h-8 w-8 text-gray-400" />
              Favorites ({wishlist.length})
            </h1>
            {wishlist.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition-colors shadow"
              >
                <Trash2 className="h-5 w-5" />
                Clear All
              </button>
            )}
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-10">
              <span role="img" aria-label="empty heart" className="text-4xl mb-2">❤️</span>
              <h2 className="text-xl font-bold mb-2">Your wishlist is empty!</h2>
              <p className="text-gray-500 mb-4">Start adding your favorite shoes and styles.</p>
              <Link to="/" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">Browse Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {wishlist.map((item) => (
                <div key={item.id} className="group relative bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-4 flex flex-col items-center">
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4 w-full flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  </button>
                  <div className="space-y-2 text-center w-full">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{item.category}</p>
                    <h3 className="font-semibold text-gray-900 text-lg truncate">{item.name}</h3>
                    <p className="text-lg font-bold text-gray-800">रू{item.price}</p>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(Math.round(item.rating || 0))].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                      {[...Array(5 - Math.round(item.rating || 0))].map((_, i) => (
                        <span key={i} className="text-gray-300">★</span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleAddToBag(item)}
                      className="w-full mt-2 bg-black text-white py-2 px-4 rounded-full font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 shadow"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Wishlist;
