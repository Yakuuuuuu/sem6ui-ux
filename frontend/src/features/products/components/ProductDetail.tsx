import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Star, Truck, RotateCcw, Shield } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Cart from '../../cart/components/Cart';
import ImageZoom from './ImageZoom';
import { useCart } from '../../cart/CartContext';
import { useRecentlyViewed } from '../../../hooks/useRecentlyViewed';
import { useProducts } from './ProductContext';
import { useWishlist } from '../../wishlist/WishlistContext';
import { useToast } from '../../../hooks/useToast';

const ProductDetail = () => {
  // All hooks at the top, unconditionally
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { addToRecentlyViewed, recentlyViewed } = useRecentlyViewed();
  const { toast } = useToast();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Find product after all hooks
  const product = products.find(p => p._id === id);
  // Helper for colors (if present)
  const colors = (product as any)?.colors || [];
  const sizes = (product as any)?.sizes || [];
  const features = (product as any)?.features || [];
  const reviewCount = (product as any)?.reviewCount || 0;
  const isWishlisted = product ? isInWishlist(product._id || product.id) : false;
  const averageRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

  useEffect(() => {
    if (product && !recentlyViewed.some(rv => rv._id === product._id)) {
      addToRecentlyViewed({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      });
    }
  }, [product, addToRecentlyViewed, recentlyViewed]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/reviews/${product?._id}`);
        const data = await res.json();
        setReviews(data);
      } catch {
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };
    if (product?._id) fetchReviews();
  }, [product?._id]);

  // Early return for loading
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading product...</p>
      </div>
    );
  }
  // Early return for not found
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Header onCartClick={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Product Not Found</h1>
          <p className="mb-4 text-gray-600">Sorry, the product you are looking for does not exist or was removed.</p>
          <Link to="/" className="text-blue-500 underline text-lg">Return Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a shoe size before adding to cart.",
        variant: "destructive",
      });
      return;
    }
    addToCart({
      productId: product._id,
      quantity: 1,
      size: selectedSize,
      color: selectedColor || (colors.length > 0 ? colors[0].name : '')
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
    setIsCartOpen(true);
  };

  const handleWishlistClick = () => {
    const id = product._id || product.id;
    if (isWishlisted) {
      removeFromWishlist(id);
      toast({ title: 'Removed from Favorites', description: `${product.name} removed from your wishlist.` });
    } else {
      addToWishlist({
        id: id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating
      });
      toast({ title: 'Added to Favorites', description: `${product.name} added to your wishlist.` });
    }
  };

  // Filter recently viewed to only include products that still exist
  const validRecentlyViewed = recentlyViewed.filter(rv => products.some(p => p._id === rv._id));
  // Related products: pick 2 other products from the current list, excluding the current product
  const relatedProducts = products.filter(p => p._id !== product._id).slice(0, 2);

  const handleReviewChange = (field: string, value: any) => {
    setReviewForm(f => ({ ...f, [field]: value }));
  };
  const handleReviewSubmit = async (e: any) => {
    e.preventDefault();
    if (!reviewForm.rating || !reviewForm.comment.trim()) return;
    setSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/reviews/${product._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ rating: reviewForm.rating, comment: reviewForm.comment }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews(r => [newReview, ...r]);
        setReviewForm({ rating: 0, comment: '' });
      } else {
        toast({ title: 'Error', description: 'Failed to submit review.' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to submit review.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex space-x-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-black">Home</Link></li>
              <li>/</li>
              <li><Link to="/men" className="hover:text-black">Men</Link></li>
              <li>/</li>
              <li className="text-black">{product.name}</li>
            </ol>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images with Zoom */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <ImageZoom
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <button
                  key={0}
                  onClick={() => setSelectedImage(0)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === 0 ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </button>
              </div>
            </div>
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <h1 className="text-3xl font-bold text-black mb-4">{product.name}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
                </div>
                <p className="text-2xl font-bold text-black">${product.price}</p>
              </div>
              <p className="text-gray-600">{product.description}</p>
              {/* Color Selection */}
              {colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Color: {selectedColor || colors[0].name}</h3>
                  <div className="flex space-x-2">
                    {colors.map((color: any) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color.name ? 'border-black' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}
              {/* Size Selection */}
              {sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Add to Cart */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white py-4 px-6 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleWishlistClick}
                  className={`w-full border-2 py-4 px-6 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    isWishlisted
                      ? 'border-red-500 text-red-500'
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>Favorite</span>
                </button>
              </div>
              {/* Features */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Features</h3>
                <ul className="list-disc pl-5 mt-2 text-gray-500">
                  {features.map((f: any, i: number) => <li key={i}>{f}</li>)}
                </ul>
              </div>
              {/* Shipping Info */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5" />
                  <span className="text-sm">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-5 w-5" />
                  <span className="text-sm">Free 60-day returns</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">2-year warranty</span>
                </div>
              </div>
              {/* --- Reviews & Ratings Section --- */}
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                  {averageRating} / 5.0
                  <span className="text-base text-gray-500">({reviews.length} reviews)</span>
                </h2>
                {/* Review Form (mock, always visible for now) */}
                <form onSubmit={handleReviewSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleReviewChange('rating', star)}
                        className={
                          star <= reviewForm.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <Star className="h-6 w-6" />
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="w-full border rounded p-2 mb-2"
                    rows={3}
                    placeholder="Write your review..."
                    value={reviewForm.comment}
                    onChange={e => handleReviewChange('comment', e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={submitting || !reviewForm.rating || !reviewForm.comment.trim()}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
                {/* Review List */}
                <div className="space-y-4">
                  {loadingReviews ? (
                    <div className="text-gray-500">Loading reviews...</div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-6">
                      <span role="img" aria-label="star" className="text-3xl mb-2">⭐</span>
                      <h3 className="text-lg font-bold mb-2">No reviews yet</h3>
                      <p className="text-gray-500 mb-2">Be the first to leave a review and help others!</p>
                    </div>
                  ) : (
                    reviews.map((r, i) => (
                      <div key={i} className="bg-white border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              className={`h-4 w-4 ${idx < r.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="ml-2 font-semibold">{r.userName || r.user || 'User'}</span>
                          <span className="ml-2 text-xs text-gray-400">{r.createdAt ? r.createdAt.slice(0, 10) : r.date}</span>
                        </div>
                        <div className="text-gray-700">{r.comment}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Recently Viewed Products */}
          {validRecentlyViewed.length > 1 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Recently Viewed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {validRecentlyViewed.slice(1, 5).map((product) => (
                  <Link key={product._id} to={`/product/${product._id}`} className="group">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600">रू{product.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                products.some(p => p._id === product._id) && (
                  <Link key={product._id} to={`/product/${product._id}`} className="group">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600">रू{product.price}</p>
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default ProductDetail;
