import Cart from '../components/Cart';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  // Always open the cart drawer on this page
  const [isCartOpen, setIsCartOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="pt-16">
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </main>
      <Footer />
    </div>
  );
};

export default CartPage; 