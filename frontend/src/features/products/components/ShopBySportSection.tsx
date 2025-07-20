
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const sports = [
  {
    id: 1,
    name: "Running",
    description: "Miles ahead of the rest",
    image: "https://cdn.fleetfeet.com/a:1.3333333333333-f:cover-w:1200/assets/Best-Nike-Running-Shoes-Masthead.png?s=4b61969f",
    link: "/sport/running"
  },
  {
    id: 2,
    name: "Basketball",
    description: "Dominate the court",
    image: "https://cdn.runrepeat.com/storage/gallery/buying_guide_primary/1445/best-cheap-nike-basketball-shoes-16425317-main.jpg",
    link: "/sport/basketball"
  },
  {
    id: 3,
    name: "Training",
    description: "Push your limits",
    image: "https://cdn.runrepeat.com/storage/gallery/product_primary/40397/nike-free-metcon-6-lab-test-and-review-21831271-main.jpg",
    link: "/sport/training"
  },
  {
    id: 4,
    name: "Soccer",
    description: "Beautiful game, beautiful gear",
    image: "https://www.soccer.com/wcm/connect/e1146a1b-7bba-459a-9bf4-1f281bda769f/1/IMG_9752.JPEG?MOD=AJPERES&CACHEID=ROOTWORKSPACE-e1146a1b-7bba-459a-9bf4-1f281bda769f/1-ozFYOnL",
    link: "/sport/soccer"
  }
];

const ShopBySportSection = () => {
  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Shop by Sport</h2>
          <p className="text-lg text-gray-300">Find gear designed for your passion</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sports.map((sport) => (
            <Link to={sport.link} key={sport.id} className="group cursor-pointer block focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 rounded-lg">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <div className="aspect-square">
                  <img 
                    src={sport.image} 
                    alt={sport.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 group-hover:text-gray-300 transition-colors">{sport.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{sport.description}</p>
                <span className="inline-flex items-center text-white font-semibold group-hover:underline">
                  Shop {sport.name}
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopBySportSection;
