import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../features/cart/components/Cart';
import ProductGrid from '../features/products/components/ProductGrid';
import { useProducts } from '../features/products/components/ProductContext';
import { useState } from 'react';

const nepaliBrands = [
  'Goldstar',
  'Shikhar',
  'Caliber',
  'Himalayan',
  'Mustang',
  'Sherpa',
  'Bata Nepal',
];

const NepaliHeritage = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { products } = useProducts();
  const nepaliProducts = products.filter(
    p => nepaliBrands.map(b => b.toLowerCase().trim()).includes((p.brand || '').toLowerCase().trim())
  );
  console.log('Nepali products:', nepaliProducts.map(p => ({ name: p.name, brand: p.brand })));

  return (
    <div className="min-h-screen bg-white transition-colors duration-200">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Nepali Heritage Collection</h1>
            <p className="text-lg text-gray-600">Handcrafted shoes from the Himalayas</p>
          </div>
          <ProductGrid products={nepaliProducts} hideViewAll />
        </div>
      </main>
      <Footer />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default NepaliHeritage; 