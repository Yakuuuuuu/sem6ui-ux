import { X } from 'lucide-react';
import { useCart } from '../CartContext';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id?: number;
  _id?: string;
  productId?: string;
  name?: string;
  price?: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
  stock?: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const cartRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | number | null>(null);
  const [confirmRemoveName, setConfirmRemoveName] = useState<string>('');

  // Store the last focused element when cart opens
  useEffect(() => {
    if (isOpen) {
      lastFocusedElement.current = document.activeElement as HTMLElement;
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
      // Prevent body scroll when cart is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus when cart closes
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Trap focus within cart when open
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !cartRef.current) return;

      const focusableElements = cartRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const handleQuantityChange = (id: string | number, newQuantity: number, productName: string) => {
    updateQuantity(id, newQuantity);
    
    // Announce to screen readers
    const message = newQuantity === 0 
      ? `${productName} removed from cart`
      : `${productName} quantity updated to ${newQuantity}`;
    
    announceToScreenReader(message);
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  const handleCheckout = () => {
    if (user) {
      // Navigate to checkout
      window.location.href = '/checkout';
      announceToScreenReader(`Proceeding to checkout with ${cartItems.length} items totaling $${getTotalPrice().toFixed(2)}`);
    } else {
      // Redirect to login with redirect back to checkout
      navigate('/login', { state: { from: '/checkout', message: 'Please log in to proceed to checkout.' } });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      aria-describedby="cart-description"
    >
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose} 
        aria-hidden="true"
      ></div>
      <div 
        ref={cartRef}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 border-b">
            <h1 id="cart-title" className="text-lg font-semibold">
              Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </h1>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              aria-label="Close shopping cart"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>

          {/* Cart Items */}
          <div 
            className="flex-1 overflow-y-auto px-6 py-4"
            id="cart-description"
          >
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <span role="img" aria-label="empty cart" className="text-4xl mb-2">🛒</span>
                <h2 className="text-xl font-bold mb-2">Your cart is feeling lonely!</h2>
                <p className="text-gray-500 mb-4">Add some amazing shoes to make it happy.</p>
                <button
                  onClick={onClose}
                  className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  aria-label="Close cart and continue shopping"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div>
                <h2 className="sr-only">Cart Items</h2>
                <ul className="space-y-4" role="list" aria-label="Items in your cart">
                  {cartItems.map((item) => (
                    <li 
                      key={item._id || item.id} 
                      className="flex items-center space-x-4 py-4 border-b"
                      role="listitem"
                    >
                      <img
                        src={item.image}
                        alt={`${item.name} product image`}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <p className="text-sm text-gray-600" aria-label={`Price: $${item.price}`}>
                          ${item.price}
                        </p>
                        <div 
                          className="flex items-center mt-2" 
                          role="group" 
                          aria-label={`Quantity controls for ${item.name}`}
                        >
                          <button
                            onClick={() => handleQuantityChange(item._id || item.id, item.quantity - 1, item.name)}
                            className="w-8 h-8 border rounded-l-md flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <span aria-hidden="true">-</span>
                          </button>
                          <div 
                            className="w-12 h-8 border-t border-b flex items-center justify-center bg-gray-50"
                            role="status"
                            aria-label={`Current quantity: ${item.quantity}`}
                          >
                            {item.quantity}
                          </div>
                          <button
                            onClick={() => handleQuantityChange(item._id || item.id, item.quantity + 1, item.name)}
                            className="w-8 h-8 border rounded-r-md flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <span aria-hidden="true">+</span>
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setConfirmRemoveId(item._id || item.id);
                          setConfirmRemoveName(item.name || 'this item');
                        }}
                        className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <footer 
              className="border-t px-6 py-4" 
              role="contentinfo" 
              aria-label="Cart summary and checkout"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">
                  Total: 
                  <span aria-label={`Total cost: $${getTotalPrice().toFixed(2)}`}>
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                aria-describedby="checkout-help"
              >
                Proceed to Checkout
              </button>
              <div id="checkout-help" className="sr-only">
                This will take you to the checkout page to complete your purchase
              </div>
            </footer>
          )}
        </div>
      </div>
      {/* Remove confirmation modal */}
      {confirmRemoveId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to remove this item?</h2>
            <p className="mb-6 text-gray-700">{confirmRemoveName}</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setConfirmRemoveId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  removeFromCart(confirmRemoveId);
                  setConfirmRemoveId(null);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
