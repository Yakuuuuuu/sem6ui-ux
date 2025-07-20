import React from 'react';
import { GlobeAltIcon, UserGroupIcon, ClipboardDocumentCheckIcon, AcademicCapIcon, ExclamationCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const sections = [
  {
    icon: <GlobeAltIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '1. Commitment to Ethical Sourcing',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>We strive to ensure our products are made in safe, lawful, and humane working conditions.</li>
        <li>We expect our suppliers to comply with all applicable laws of Nepal, including those prohibiting child labor and forced labor.</li>
      </ul>
    )
  },
  {
    icon: <ClipboardDocumentCheckIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '2. Supplier Verification',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>We conduct due diligence on suppliers to assess risks related to human trafficking and slavery.</li>
      </ul>
    )
  },
  {
    icon: <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '3. Audits',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Periodic audits are conducted to ensure compliance with Nepali labor laws.</li>
      </ul>
    )
  },
  {
    icon: <UserGroupIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '4. Training',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Employees and management are trained on identifying and mitigating supply chain risks.</li>
      </ul>
    )
  },
  {
    icon: <ExclamationCircleIcon className="h-6 w-6 text-blue-600 mr-2" />, title: '5. Reporting',
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Concerns about supply chain practices can be reported to <a href="mailto:contact@shoenp.com" className="text-blue-600 underline">contact@shoenp.com</a>.</li>
      </ul>
    )
  },
];

const CASupplyChainsAct = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 px-2 relative">
    <a href="/" className="fixed top-6 left-6 z-20 flex items-center bg-white shadow-lg rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition border border-gray-200">
      <ArrowLeftIcon className="h-5 w-5 mr-2" /> Home
    </a>
    <div className="max-w-3xl mx-auto bg-white/90 shadow-xl rounded-2xl p-8 md:p-12 border border-gray-100">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
        <GlobeAltIcon className="h-8 w-8 text-blue-600" /> CA Supply Chains Act Statement
      </h1>
      <p className="mb-6 text-gray-600 text-lg">While the California Transparency in Supply Chains Act is a U.S. law, shoeNP is committed to ethical business practices and compliance with Nepali labor and human rights laws, including the Labour Act, 2074 (2017).</p>
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
            <UserGroupIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Contact Us</h2>
          </div>
          <p className="text-gray-700">For more information about our supply chain practices, contact <a href="mailto:contact@shoenp.com" className="text-blue-600 underline">contact@shoenp.com</a>.</p>
        </div>
      </div>
    </div>
  </div>
);

export default CASupplyChainsAct; 