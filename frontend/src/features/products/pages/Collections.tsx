import { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Cart from '../../cart/components/Cart';
import { useProducts } from '../components/ProductContext';
import ProductGrid from '../components/ProductGrid';

const Collections = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { products } = useProducts();

  const collections = [
    {
      id: 1,
      name: 'Air Max Collection',
      description: 'Iconic Air Max sneakers with visible air cushioning',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      link: '/search?q=Air+Max'
    },
    {
      id: 2,
      name: 'Jordan Collection',
      description: 'Basketball-inspired footwear and apparel',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      link: '/search?q=Jordan'
    },
    {
      id: 3,
      name: 'Training Collection',
      description: 'Performance gear for your fitness journey',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      link: '/search?q=Training'
    },
    {
      id: 4,
      name: 'Nepali Heritage Collection',
      description: 'Handcrafted shoes from the Himalayas',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      link: '/collections/nepali-heritage'
    },
    {
      id: 5,
      name: 'Lifestyle Collection',
      description: 'Casual wear for everyday comfort',
      image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      link: '/search?q=Lifestyle'
    },
    {
      id: 6,
      name: 'Running Collection',
      description: 'High-performance running gear',
      image: 'https://cdn.runrepeat.com/storage/gallery/buying_guide_primary/17/17-best-nike-running-shoes-15275034-960.jpg',
      link: '/search?q=Running'
    }
  ];

  const nepaliBrands = [
    'Goldstar',
    'Shikhar',
    'Caliber',
    'Himalayan',
    'Mustang',
    'Sherpa',
    'Bata Nepal',
  ];

  const nepaliProducts = products.filter(p => nepaliBrands.includes(p.brand));

  return (
    <Routes>
      <Route
        path="/collections/nepali-heritage"
        element={
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
        }
      />
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-white transition-colors duration-200">
            <Header onCartClick={() => setIsCartOpen(true)} />
            <main className="pt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Collections</h1>
                  <p className="text-lg text-gray-600">Discover curated collections of premium footwear</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {collections.map((collection) => (
                    <Link 
                      key={collection.id} 
                      to={collection.link}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <img 
                        src={collection.image} 
                        alt={collection.name}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{collection.name}</h3>
                        <p className="text-gray-600 mb-4">{collection.description}</p>
                        <span className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors">
                          Explore Collection
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  {/* Admin Panel link removed */}
                </div>
              </div>
            </main>
            <Footer />
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          </div>
        }
      />
    </Routes>
  );
};

export default Collections;
