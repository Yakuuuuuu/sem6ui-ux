import { useState, useEffect } from 'react';
import { ChevronLeft, CreditCard, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../features/cart/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement } from '@stripe/react-stripe-js';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../features/auth/AuthContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY || '');

// Add a CardForm component for Stripe Elements
function CardForm({ amount, onPaymentSuccess }: { amount: number, onPaymentSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleCardPayment = async () => {
    setProcessing(true);
    setCardError(null);
    if (!stripe || !elements) {
      setCardError('Stripe is not loaded.');
      setProcessing(false);
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/stripe/payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) {
        setCardError('Failed to create payment intent.');
        setProcessing(false);
        return;
      }
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setCardError('Card element not found.');
        setProcessing(false);
        return;
      }
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      setProcessing(false);
      if (result && result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        onPaymentSuccess();
      } else {
        setCardError('Payment failed. Please try again.');
      }
    } catch (err) {
      setCardError('Payment failed.');
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <CardElement options={{ hidePostalCode: true }} className="p-3 border rounded" />
      {cardError && <div className="text-red-500 text-sm">{cardError}</div>}
      <button
        type="button"
        className="w-full bg-black text-white py-3 rounded-full font-semibold mt-4"
        onClick={handleCardPayment}
        disabled={processing}
      >
        {processing ? 'Processing...' : 'Pay & Continue'}
      </button>
    </div>
  );
}

// Separate component for the checkout form
function CheckoutForm() {
  const { cartItems, getTotalPrice, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment Info
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    
    // Options
    saveInfo: false,
    newsletter: false
  });

  const steps = [
    { id: 1, title: 'Shipping', completed: currentStep > 1 },
    { id: 2, title: 'Payment', completed: currentStep > 2 },
    { id: 3, title: 'Review', completed: false }
  ];

  const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode', 'country'];
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateShipping = () => {
    const newErrors: { [key: string]: string } = {};
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData] || String(formData[field as keyof typeof formData]).trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (!validateShipping()) return;
      setCurrentStep(currentStep + 1);
    }
    // Payment step handled by CardForm
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [orderPlaced, setOrderPlaced] = useState(false);

  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout', message: 'Please log in to proceed to checkout.' } });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (orderPlaced) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000); // Auto-redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [orderPlaced, navigate]);

  const saveOrder = async () => {
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL;
    const newOrder = {
      orderNumber: 'ORD-' + Date.now(),
      totalAmount: getTotalPrice(),
      status: 'pending',
      items: cartItems.map(item => ({
        productId: item.productId || item._id || item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        size: item.size
      })),
    };
    await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newOrder),
    });
  };

  const savePaymentMethod = async () => {
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL;
    // For demo, use dummy values; in real app, get from Stripe response
    const cardNumber = formData.cardNumber || '';
    const last4 = cardNumber.slice(-4);
    const brand = 'Visa'; // Replace with real brand if available
    const expMonth = '12'; // Replace with real expMonth if available
    const expYear = '2030'; // Replace with real expYear if available
    await fetch(`${API_URL}/payment-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ brand, last4, expMonth, expYear }),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 3) {
      if (!paymentSuccess) {
        alert('Please complete payment before placing the order.');
        return;
      }
      setOrderPlaced(true);
      await saveOrder();
      await savePaymentMethod();
      await clearCart();
    }
    console.log('Order submitted:', { formData, cartItems });
    alert('Order placed successfully!');
  };

  const handleStripePayment = async () => {
    const stripe = await stripePromise;
    // In a real app, you would create a Checkout Session on your backend and get the sessionId
    // For demo, redirect to Stripe test page
    await stripe?.redirectToCheckout({
      lineItems: [{ price: 'price_1NXXXXXX', quantity: 1 }], // Replace with your real price ID
      mode: 'payment',
      successUrl: window.location.origin + '/success',
      cancelUrl: window.location.origin + '/checkout',
    });
  };

  const subtotal = cartItems.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const [showPopup, setShowPopup] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setCurrentStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => {}} />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step.completed 
                      ? 'bg-black border-black text-white' 
                      : currentStep === step.id
                        ? 'border-black text-black'
                        : 'border-gray-300 text-gray-300'
                  }`}>
                    {step.completed ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep === step.id ? 'text-black' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-12 h-px bg-gray-300 mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step 1: Shipping Information */}
                  {currentStep === 1 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address *
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Apartment, suite, etc. (optional)
                          </label>
                          <input
                            type="text"
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ZIP Code *
                            </label>
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Payment Information */}
                  {currentStep === 2 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6">Payment</h2>
                      <CardForm
                        amount={getTotalPrice() * 100}
                        onPaymentSuccess={handlePaymentSuccess}
                      />
                    </div>
                  )}

                  {/* Step 3: Review Order */}
                  {currentStep === 3 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
                      
                      <div className="space-y-6">
                        {/* Shipping Address */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold mb-2">Shipping Address</h3>
                          <p className="text-sm text-gray-600">
                            {formData.firstName} {formData.lastName}<br />
                            {formData.address}<br />
                            {formData.apartment && `${formData.apartment}\n`}
                            {formData.city}, {formData.state} {formData.zipCode}
                          </p>
                        </div>

                        {/* Payment Method */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold mb-2">Payment Method</h3>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-5 w-5" />
                            <span className="text-sm">**** **** **** {formData.cardNumber.slice(-4)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                      disabled={currentStep === 1}
                    >
                      <ChevronLeft className="h-5 w-5 inline-block mr-2" /> Back
                    </button>
                    {currentStep === 1 && (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                      >
                        Continue
                      </button>
                    )}
                    {currentStep === 3 && (
                      <button
                        type="submit"
                        className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                        disabled={!paymentSuccess}
                      >
                        Place Order
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item._id || item.id} className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        {item.size && (
                          <p className="text-xs text-gray-500">Size: {item.size}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 border rounded-l flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 border rounded-r flex items-center justify-center hover:bg-gray-100"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">${item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>

                {subtotal < 50 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Add ${50 - subtotal} more for free shipping!
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  className="mt-6 w-full bg-gray-100 text-black py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                  onClick={() => navigate('/cart')}
                >
                  Edit Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {currentStep === 3 && showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Thank you for your purchase!</h2>
            <p className="mb-6">We hope you love your new shoes! 🎉</p>
            <div className="flex flex-col gap-3">
              <button
                className="bg-black text-white py-2 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
              <button
                className="bg-gray-200 text-black py-2 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                onClick={() => navigate('/')}
              >
                Home
              </button>
            </div>
          </div>
        </div>
      )}

      {orderPlaced && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center animate-fade-in">
            <svg className="mx-auto mb-4" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="green" strokeWidth="2" fill="none"/><path d="M8 12l2 2l4-4" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h2 className="text-2xl font-bold mb-2 text-green-700">Order Placed!</h2>
            <p className="mb-6 text-gray-700">Thank you for shopping with us. You will be redirected to the home page shortly.</p>
            <button
              className="bg-black text-white py-2 px-6 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              onClick={() => navigate('/')}
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Checkout component that wraps everything with Elements
const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
