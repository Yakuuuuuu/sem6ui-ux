import ProductGrid from './ProductGrid';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => {}} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProductGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllProducts; 