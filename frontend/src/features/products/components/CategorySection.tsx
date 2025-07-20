
import { Link } from 'react-router-dom';

const CategorySection = () => {
  const categories = [
    {
      name: 'Men',
      image: 'https://techspec.cc/content/images/size/w1140/2023/11/spring-2001_men-s-footwear_1-1-2-1.jpg',
      link: '/men'
    },
    {
      name: 'Women',
      image: 'https://pyxis.nymag.com/v1/imgs/a79/296/3731bcf57b5c9cdb8593c277c72e21ea7d-16-nike-shoes-lede.2x.rsocial.w600.jpg',
      link: '/women'
    },
    {
      name: 'Kids',
      image: 'https://todaysparent.mblycdn.com/tp/resized/2024/06/1600x1200/The-Best-Nike-Shoes-for-Kids-2024.png',
      link: '/kids'
    }
  ];

  return (
    <section className="py-16 bg-gray-50" role="region" aria-labelledby="categories-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="categories-heading" className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">Find the perfect gear for everyone</p>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          role="list"
          aria-label="Product categories"
        >
          {categories.map((category) => (
            <div key={category.name} role="listitem">
              <Link
                to={category.link}
                className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 block"
                aria-label={`Shop ${category.name} category`}
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={category.image}
                    alt={`${category.name} category featuring athletic wear and footwear`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" aria-hidden="true"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                  <span 
                    className="inline-block bg-white text-black px-4 py-2 text-sm font-semibold rounded-full group-hover:bg-gray-100 transition-colors duration-300"
                    aria-hidden="true"
                  >
                    Shop Now
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
