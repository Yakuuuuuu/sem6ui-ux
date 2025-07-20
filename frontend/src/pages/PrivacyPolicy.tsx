import React from 'react';
import { ShieldCheckIcon, UserIcon, LockClosedIcon, DocumentTextIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const sections = [
  {
    icon: <UserIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '1. Information We Collect',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Personal details (name, email, address, phone number) when you register or make a purchase.</li>
        <li>Usage data (pages visited, products viewed, IP address) for analytics and service improvement.</li>
      </ul>
    )
  },
  {
    icon: <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '2. Use of Information',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>To process orders and provide customer service.</li>
        <li>To send updates, offers, and newsletters (with your consent).</li>
        <li>To comply with legal obligations under Nepali law.</li>
      </ul>
    )
  },
  {
    icon: <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '3. Sharing of Information',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>We do not sell or rent your personal information.</li>
        <li>We may share data with trusted service providers (e.g., payment processors) as required for business operations.</li>
        <li>We may disclose information if required by law or government authorities in Nepal.</li>
      </ul>
    )
  },
  {
    icon: <LockClosedIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '4. Data Security',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>We use industry-standard security measures to protect your data.</li>
        <li>Access to your information is restricted to authorized personnel only.</li>
      </ul>
    )
  },
  {
    icon: <UserIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '5. Your Rights',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>You have the right to access, correct, or delete your personal data as per the Privacy Act, 2075.</li>
        <li>To exercise your rights, contact us at <a href="mailto:contact@shoenp.com" className="text-blue-600 underline">contact@shoenp.com</a>.</li>
      </ul>
    )
  },
];

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 px-2 relative">
    <a href="/" className="fixed top-6 left-6 z-20 flex items-center bg-white shadow-lg rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition border border-gray-200">
      <ArrowLeftIcon className="h-5 w-5 mr-2" /> Home
    </a>
    <div className="max-w-3xl mx-auto bg-white/90 shadow-xl rounded-2xl p-8 md:p-12 border border-gray-100">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
        <ShieldCheckIcon className="h-8 w-8 text-blue-600" /> Privacy Policy
      </h1>
      <p className="mb-6 text-gray-600 text-lg">At shoeNP, we are committed to protecting your privacy in accordance with the laws of Nepal, including the Privacy Act, 2075 (2018). This policy explains how we collect, use, and safeguard your personal information.</p>
      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={section.title}>
            <div className="flex items-center mb-2">
              {section.icon}
              <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
            </div>
            {section.content}
            {idx < sections.length - 1 && <hr className="my-6 border-gray-200" />}
          </div>
        ))}
        <div>
          <div className="flex items-center mb-2">
            <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">6. Changes to This Policy</h2>
          </div>
          <p className="mb-4 text-gray-700">We may update this policy. Changes will be posted on this page with the effective date.</p>
        </div>
        <div>
          <div className="flex items-center mb-2">
            <UserIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Contact Us</h2>
          </div>
          <p className="text-gray-700">If you have questions about this policy, email us at <a href="mailto:contact@shoenp.com" className="text-blue-600 underline">contact@shoenp.com</a>.</p>
        </div>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy; 