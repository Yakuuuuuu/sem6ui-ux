import { useEffect, useState } from 'react';
import { useProducts, Product } from './ProductContext';
import { useNavigate } from 'react-router-dom';

const BrandLogosSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { products } = useProducts();

  const brands = [
    {
      id: 1,
      name: 'Nike',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/512px-Logo_NIKE.svg.png'
    },
    {
      id: 2,
      name: 'Adidas',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/512px-Adidas_Logo.svg.png'
    },
    {
      id: 3,
      name: 'Puma',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/da/Puma_complete_logo.svg/512px-Puma_complete_logo.svg.png'
    },
    {
      id: 4,
      name: 'Vans',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Vans-logo.svg/512px-Vans-logo.svg.png'
    },
    {
      id: 5,
      name: 'Converse',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Converse_logo.svg/512px-Converse_logo.svg.png'
    },
    {
      id: 6,
      name: 'New Balance',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/New_Balance_logo.svg/512px-New_Balance_logo.svg.png'
    },
    // Real Nepali Shoe Brands
    {
      id: 7,
      name: 'Goldstar',
      logo: 'https://images.seeklogo.com/logo-png/49/1/goldstar-logo-png_seeklogo-490403.png'
    },
    {
      id: 8,
      name: 'Bata Nepal',
      logo: 'https://images.seeklogo.com/logo-png/1/1/bata-logo-png_seeklogo-17000.png'
    },
    {
      id: 9,
      name: 'Erke',
      logo: 'https://images.seeklogo.com/logo-png/28/2/erke-logo-png_seeklogo-281917.png'
    },
    {
      id: 10,
      name: 'Peak',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Peak_Logo.svg/426px-Peak_Logo.svg.png'
    },
    {
      id: 11,
      name: 'Shikhar',
      logo: 'https://www.shikharshoe.com.np/img/shikhar-logo/shikhar-1.png'
    },
    {
      id: 12,
      name: 'Caliber',
      logo: 'https://caliber-kd-shoes.s3.ap-south-1.amazonaws.com/uploads/2023/11/19183610/cropped-1200x630wa.png'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('brand-logos-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const handleBrandClick = (brandName: string) => {
    const brandProducts = products.filter((p: Product) => p.brand === brandName);
    console.log(`${brandName} products:`, brandProducts);
    
    // Navigate to search page with brand filter
    navigate(`/search?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <section 
      id="brand-logos-section"
      className="py-16 bg-gray-50 overflow-hidden"
      aria-label="Shoe brand partners"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Top Shoe Brands
          </h2>
          <p className="text-lg text-gray-600">
            Click on any brand to explore their collection
          </p>
        </div>

        {/* Infinite scrolling brands container */}
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-infinite-scroll min-w-max">
            {/* First set of brands */}
            {brands.map((brand, index) => (
              <div
                key={`first-${brand.id}`}
                className={`flex-shrink-0 mx-4 flex items-center justify-center p-6 bg-white rounded-lg shadow-sm transition-all duration-300 ${
                  isVisible 
                    ? 'opacity-100' 
                    : 'opacity-0'
                }`}
                style={{
                  transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.3s ease`,
                  minWidth: '200px',
                  width: '200px'
                }}
                aria-label={`${brand.name} logo`}
              >
                <div className="w-32 h-16 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
              </div>
            ))}
            
            {/* Second set of brands for seamless infinite loop */}
            {brands.map((brand) => (
              <div
                key={`second-${brand.id}`}
                className="flex-shrink-0 mx-4 flex items-center justify-center p-6 bg-white rounded-lg shadow-sm transition-all duration-300 opacity-100"
                style={{
                  minWidth: '200px',
                  width: '200px',
                  transition: 'transform 0.3s ease'
                }}
                aria-label={`${brand.name} logo`}
              >
                <div className="w-32 h-16 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandLogosSection;

