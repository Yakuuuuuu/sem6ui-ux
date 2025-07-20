import { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const CONTACT_INFO = [
  {
    icon: <EnvelopeIcon className="h-6 w-6 text-blue-600" />,
    label: 'Email',
    value: 'contact@shoenp.com',
    href: 'mailto:contact@shoenp.com',
  },
  {
    icon: <PhoneIcon className="h-6 w-6 text-blue-600" />,
    label: 'Phone',
    value: '+977-1-1234567',
    href: 'tel:+97711234567',
  },
  {
    icon: <MapPinIcon className="h-6 w-6 text-blue-600" />,
    label: 'Address',
    value: 'Kathmandu, Nepal',
    href: null,
  },
];

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to send message.');
        setStatus('error');
        return;
      }
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Failed to send message.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 px-2 relative">
      <a href="/" className="fixed top-6 left-6 z-20 flex items-center bg-white shadow-lg rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition border border-gray-200">
        <ArrowLeftIcon className="h-5 w-5 mr-2" /> Home
      </a>
      <div className="max-w-4xl mx-auto bg-white/90 shadow-xl rounded-2xl p-0 md:p-0 border border-gray-100 flex flex-col md:flex-row overflow-hidden">
        {/* Contact Info Panel */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 md:w-1/3 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <ul className="space-y-4">
              {CONTACT_INFO.map((info) => (
                <li key={info.label} className="flex items-start gap-3">
                  {info.icon}
                  <div>
                    <div className="text-sm text-gray-500 font-medium">{info.label}</div>
                    {info.href ? (
                      <a href={info.href} className="text-gray-800 hover:text-blue-700 font-semibold underline">
                        {info.value}
                      </a>
                    ) : (
                      <span className="text-gray-800 font-semibold">{info.value}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 text-xs text-gray-400">We usually respond within 24 hours.</div>
        </div>
        {/* Contact Form */}
        <div className="flex-1 p-8 md:p-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Contact Us</h1>
          <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                required
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                rows={5}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'success' && (
              <div className="flex items-center text-green-600 mt-2 animate-fade-in">
                <CheckCircleIcon className="h-6 w-6 mr-2" /> Message sent successfully!
              </div>
            )}
            {status === 'error' && <div className="text-red-600 mt-2">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 