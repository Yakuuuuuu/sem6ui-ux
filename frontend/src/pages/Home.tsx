import { useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../features/products/components/ProductGrid';
import CategorySection from '../features/products/components/CategorySection';
import NewFeaturedSection from '../features/products/components/NewFeaturedSection';
import TrendingSection from '../features/products/components/TrendingSection';
import VideoSection from '../features/products/components/VideoSection';
import BrandLogosSection from '../features/products/components/BrandLogosSection';
import ShopBySportSection from '../features/products/components/ShopBySportSection';
import NewsletterSection from '../features/products/components/NewsletterSection';
import Footer from '../components/Footer';
import Cart from '../features/cart/components/Cart';
import CompareDrawer from '../features/products/components/CompareDrawer';
import { CompareProvider } from '../features/products/CompareContext';
import { useProducts } from '../features/products/components/ProductContext';
import { Link } from 'react-router-dom';
import ProductCard from '../features/products/components/ProductCard';

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { products } = useProducts();

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <CompareProvider>
      <div className="min-h-screen bg-white transition-colors duration-200">
        {/* Skip Navigation Link */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        
        <Header onCartClick={() => setIsCartOpen(true)} />
        
        <main id="main-content" role="main">
          <h1 className="sr-only">shoeNP - Athletic Shoes, Clothing & Accessories</h1>
          
          <section aria-label="Hero banner">
            <HeroSection />
          </section>
          
          <section aria-label="New and featured products">
            <NewFeaturedSection />
          </section>
          
          <section aria-label="Product catalog">
            <ProductGrid products={featuredProducts} />
          </section>
          
          <section aria-label="Brand video showcase">
            <VideoSection />
          </section>
          
          <section aria-label="Partner brands">
            <BrandLogosSection />
          </section>
          
          <section aria-label="Trending products">
            <TrendingSection />
          </section>
          
          <section aria-label="Shop by category">
            <CategorySection />
          </section>
          
          <section aria-label="Shop by sport">
            <ShopBySportSection />
          </section>
          
          <section aria-label="Newsletter signup">
            <NewsletterSection />
          </section>
        </main>
        
        <footer className="bg-black text-white py-8" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <span className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              © 2025 shoeNP. Thank you for supporting local! 🙏
            </span>
            <nav aria-label="Legal links" className="flex space-x-6">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</Link>
              <Link to="/terms-of-use" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Use</Link>
              <Link to="/ca-supply-chains-act" className="text-gray-400 hover:text-white transition-colors duration-200">CA Supply Chains Act</Link>
            </nav>
          </div>
        </footer>
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <CompareDrawer />
      </div>
    </CompareProvider>
  );
};

export default Index;
