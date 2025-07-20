import { Toaster } from "./components/toaster";
import { TooltipProvider } from "./components/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './features/auth/AuthContext';
import { CartProvider } from './features/cart/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CompareProvider } from './features/products/CompareContext';
import { ProductProvider } from './features/products/components/ProductContext';
import { WishlistProvider } from './features/wishlist/WishlistContext';
import Index from "./pages/Home";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Kids from "./pages/Kids";
import Collections from "./features/products/pages/Collections";
import ProductDetail from "./features/products/components/ProductDetail";
import Search from "./features/products/pages/Search";
import Login from "./features/auth/pages/Login";
import Signup from "./features/auth/pages/Signup";
import Profile from "./features/auth/pages/Profile";
import Wishlist from "./features/wishlist/pages/Wishlist";
import Checkout from "./pages/Checkout";
import Admin from "./features/admin/pages/Admin";
import NotFound from "./pages/NotFound";
import CartPage from './features/cart/pages/CartPage';
import AllProducts from './features/products/components/AllProducts';
import NepaliHeritage from "./pages/NepaliHeritage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import CASupplyChainsAct from "./pages/CASupplyChainsAct";
import Running from './pages/Running';
import Basketball from './pages/Basketball';
import Training from './pages/Training';
import Soccer from './pages/Soccer';
import ContactUs from "./pages/ContactUs";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <TooltipProvider>
              <CompareProvider>
                <ProductProvider>
                  <WishlistProvider>
                    <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/men" element={<Men />} />
                        <Route path="/women" element={<Women />} />
                        <Route path="/kids" element={<Kids />} />
                        <Route path="/collections" element={<Collections />} />
                        <Route path="/collections/nepali-heritage" element={<NepaliHeritage />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/products" element={<AllProducts />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-use" element={<TermsOfUse />} />
                        <Route path="/ca-supply-chains-act" element={<CASupplyChainsAct />} />
                        <Route path="/sport/running" element={<Running />} />
                        <Route path="/sport/basketball" element={<Basketball />} />
                        <Route path="/sport/training" element={<Training />} />
                        <Route path="/sport/soccer" element={<Soccer />} />
                        <Route path="/contact" element={<ContactUs />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <Toaster />
                    </BrowserRouter>
                  </WishlistProvider>
                </ProductProvider>
              </CompareProvider>
            </TooltipProvider>
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
