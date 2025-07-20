import React from 'react';
import { DocumentTextIcon, UserIcon, LockClosedIcon, CurrencyRupeeIcon, ArrowLeftIcon, ScaleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const sections = [
  {
    icon: <UserIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '1. Use of Website',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>You must be at least 18 years old or have parental consent to use this site.</li>
        <li>You agree not to use the site for unlawful purposes or in violation of Nepali law.</li>
      </ul>
    )
  },
  {
    icon: <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '2. Intellectual Property',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>All content (text, images, logos) is the property of shoeNP or its licensors.</li>
        <li>You may not reproduce, distribute, or use content without written permission.</li>
      </ul>
    )
  },
  {
    icon: <LockClosedIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '3. User Accounts',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>You are responsible for maintaining the confidentiality of your account information.</li>
        <li>Notify us immediately of any unauthorized use of your account.</li>
      </ul>
    )
  },
  {
    icon: <CurrencyRupeeIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '4. Orders and Payments',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>All orders are subject to acceptance and availability.</li>
        <li>Prices are listed in Nepalese Rupees (NPR) and include applicable taxes as per Nepali law.</li>
      </ul>
    )
  },
  {
    icon: <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '5. Limitation of Liability',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>shoeNP is not liable for indirect or consequential damages.</li>
        <li>Our liability is limited to the value of the products purchased.</li>
      </ul>
    )
  },
];

const TermsOfUse = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 px-2 relative">
    <a href="/" className="fixed top-6 left-6 z-20 flex items-center bg-white shadow-lg rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition border border-gray-200">
      <ArrowLeftIcon className="h-5 w-5 mr-2" /> Home
    </a>
    <div className="max-w-3xl mx-auto bg-white/90 shadow-xl rounded-2xl p-8 md:p-12 border border-gray-100">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
        <DocumentTextIcon className="h-8 w-8 text-blue-600" /> Terms of Use
      </h1>
      <p className="mb-2 text-gray-500 text-sm">Effective Date: [Insert Date]</p>
      <p className="mb-6 text-gray-600 text-lg">Welcome to shoeNP. By using our website, you agree to comply with the following terms and conditions, governed by the laws of Nepal.</p>
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
            <ScaleIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">6. Governing Law</h2>
          </div>
          <p className="mb-4 text-gray-700">These terms are governed by the laws of Nepal. Any disputes will be resolved in the courts of Kathmandu.</p>
        </div>
        <div>
          <div className="flex items-center mb-2">
            <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">7. Changes to Terms</h2>
          </div>
          <p className="mb-4 text-gray-700">We may update these terms at any time. Continued use of the site constitutes acceptance of the new terms.</p>
        </div>
        <div>
          <div className="flex items-center mb-2">
            <UserIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Contact Us</h2>
          </div>
          <p className="text-gray-700">For questions, contact <a href="mailto:contact@shoenp.com" className="text-blue-600 underline">contact@shoenp.com</a>.</p>
        </div>
      </div>
    </div>
  </div>
);

export default TermsOfUse; 