import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const legalLinks = [
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/terms-of-use", label: "Terms of Use" },
    { to: "/ca-supply-chains-act", label: "CA Supply Chains Act" },
    { to: "/contact", label: "Contact Us" },
  ];
  return (
    <footer className="bg-black text-white py-8" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <span className="text-gray-400 text-center md:text-left mb-4 md:mb-0">© 2025 shoeNP. Thank you for supporting local! 🙏</span>
        <nav aria-label="Legal links" className="flex space-x-6">
          {legalLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={
                `text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 rounded px-2 py-1` +
                (location.pathname === link.to ? ' underline text-white' : '')
              }
              aria-current={location.pathname === link.to ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
