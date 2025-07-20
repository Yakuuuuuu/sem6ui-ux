
import { ArrowRight } from 'lucide-react';

const NewFeaturedSection = () => {
  const featuredItems = [
    {
      id: 1,
      title: "Air Max Plus",
      subtitle: "New Colorways",
      description: "Bold colors meet maximum comfort in the latest Air Max Plus collection.",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      cta: "Shop Now"
    },
    {
      id: 2,
      title: "Dri-FIT Technology",
      subtitle: "Stay Dry. Stay Focused.",
      description: "Engineered to move sweat away from your skin for quicker evaporation.",
      image: "https://crosskix.com/cdn/shop/products/Night-lateral_1280x.png?v=1749130863",
      cta: "Explore"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">New & Featured</h2>
          <p className="text-lg text-gray-600">Discover the latest innovations in athletic performance</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">{item.subtitle}</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 mb-6">{item.description}</p>
                <button className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors duration-200">
                  {item.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewFeaturedSection;
