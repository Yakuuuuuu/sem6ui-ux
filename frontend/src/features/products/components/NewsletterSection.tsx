import { useState } from 'react';
import { Mail } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Newsletter signup:', email);
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-10 bg-gradient-to-r from-gray-900 to-black dark:from-gray-800 dark:to-gray-900 text-white transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail className="h-12 w-12 mx-auto mb-6 text-white" />
        <h2 className="text-2xl font-bold mb-2">Stay in the Loop</h2>
        <p className="text-base text-gray-300 dark:text-gray-400 mb-4">
          Be the first to know about new releases, exclusive offers, and Nike news.
        </p>
        
        {isSubscribed ? (
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block">
            Thanks for subscribing! Check your email for confirmation.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-2 bg-white dark:bg-gray-600 text-black dark:text-white font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors duration-200"
              >
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              By subscribing, you agree to shoeNP's Privacy Policy and Terms of Use.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
