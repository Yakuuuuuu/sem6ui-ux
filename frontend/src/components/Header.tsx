import { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingCart, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../features/cart/CartContext';
import ThemeToggle from './ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../features/wishlist/WishlistContext';

interface HeaderProps {
  onCartClick: () => void;
}

const Header = ({ onCartClick }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const navigationItems = [
    { label: 'Men', href: '/men' },
    { label: 'Women', href: '/women' },
    { label: 'Kids', href: '/kids' },
    { label: 'Collections', href: '/collections' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Focus management for search
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle escape key for modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
        if (isSearchOpen) {
          setIsSearchOpen(false);
          // Return focus to search button
          const searchButton = document.querySelector('[aria-label*="search"]') as HTMLElement;
          searchButton?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen, isSearchOpen]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      announceToScreenReader(`Searching for ${searchQuery}`);
    }
  };

  const handleUserClick = () => {
    // Navigate to profile page
    window.location.href = '/profile';
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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm transition-colors duration-200" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a 
              href="/" 
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
              aria-label="shoeNP - Go to homepage"
            >
              <img 
                src="/favicon.png" 
                alt="shoeNP Logo" 
                className="h-8 w-8 object-contain transition-colors duration-200" 
                style={{ display: 'block' }}
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
            <ul className="flex space-x-8" role="list">
              {navigationItems.map((item) => (
                <li key={item.label} role="listitem">
                  <a
                    href={item.href}
                    className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
                    aria-current={window.location.pathname === item.href ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4" role="toolbar" aria-label="Header actions">
            {/* Login Button */}
            <ThemeToggle />

            {/* Search */}
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                announceToScreenReader(isSearchOpen ? 'Search closed' : 'Search opened');
              }}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
              aria-label={isSearchOpen ? "Close search" : "Open search"}
              aria-expanded={isSearchOpen}
              aria-controls="search-input"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* User */}
            <button 
              ref={userButtonRef}
              onClick={handleUserClick}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
              aria-label="Go to user profile"
            >
              <User className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Cart */}
            <button
              onClick={() => {
                onCartClick();
                announceToScreenReader('Shopping cart opened');
              }}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
              aria-label={cartItemCount > 0 ? `Open shopping cart with ${cartItemCount} item${cartItemCount !== 1 ? 's' : ''}` : 'Open empty shopping cart'}
              aria-describedby="cart-count"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {cartItemCount > 0 && (
                <span 
                  id="cart-count"
                  className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  aria-label={`${cartItemCount} items in cart`}
                >
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigate('/wishlist')}
              className="relative p-2 text-gray-600 hover:text-red-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
              aria-label={wishlist.length > 0 ? `Open wishlist with ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''}` : 'Open empty wishlist'}
              aria-describedby="wishlist-count"
            >
              <Heart className={`h-5 w-5 ${wishlist.length > 0 ? 'fill-current text-red-500' : ''}`} aria-hidden="true" />
              {wishlist.length > 0 && (
                <span
                  id="wishlist-count"
                  className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  aria-label={`${wishlist.length} items in wishlist`}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                announceToScreenReader(isMobileMenuOpen ? 'Mobile menu closed' : 'Mobile menu opened');
              }}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pb-4" role="search" aria-label="Product search">
            <label htmlFor="search-input" className="sr-only">
              Search shoeNP products
            </label>
            <div className="relative">
              <input
                id="search-input"
                ref={searchInputRef}
                type="text"
                placeholder="Search shoeNP products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors duration-200"
                aria-describedby="search-instructions"
                autoComplete="off"
                role="searchbox"
                aria-expanded="false"
              />
              <div id="search-instructions" className="sr-only">
                Press Enter to search, or Escape to close search
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            ref={mobileMenuRef}
            className="md:hidden pb-4"
            role="navigation"
            aria-label="Mobile navigation menu"
          >
            <nav>
              <ul className="flex flex-col space-y-2" role="list">
                {navigationItems.map((item) => (
                  <li key={item.label} role="listitem">
                    <a
                      href={item.href}
                      className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded block"
                      aria-current={window.location.pathname === item.href ? 'page' : undefined}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
