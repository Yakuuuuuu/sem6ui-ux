import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../features/cart/components/Cart';
import ProductCard from '../features/products/components/ProductCard';
import { useProducts } from '../features/products/components/ProductContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Soccer = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { products } = useProducts();
  // Filter products for soccer shoes (by category)
  const soccerProducts = products.filter(
    p => p.category && p.category.toLowerCase().includes('soccer')
  );

  return (
    <div className="min-h-screen bg-white transition-colors duration-200">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Soccer Shoes</h1>
            <p className="text-lg text-gray-600">Beautiful game, beautiful gear</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {soccerProducts.map((product) => (
              <Link key={product._id || product.id} to={`/product/${product._id || product.id}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Soccer; 