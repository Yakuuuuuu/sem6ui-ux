import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useState } from 'react';
import { useProducts } from './ProductContext';
import { Link } from 'react-router-dom';

const TrendingSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { products } = useProducts();

  // Use _id for MongoDB products
  const trendingProducts = products.slice(0, 5); // Just take the first 5 as trending for now

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev === trendingProducts.length - 3 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? trendingProducts.length - 3 : prev - 1
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Trending</h2>
          <div className="flex space-x-2">
            <button 
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Previous products"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Next products"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
          >
            {trendingProducts.map((product) => (
              <div key={product._id || product.id} className="w-1/3 flex-shrink-0 px-2">
                <Link to={`/product/${product._id || product.id}`} style={{ display: 'block', height: '100%' }}>
                  <div className="group relative bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                      <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-lg font-bold text-gray-900">${product.price}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
