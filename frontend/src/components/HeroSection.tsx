import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Remove friendlyWelcome and Nepali tagline
  // const friendlyWelcome = "";
  const nepaliTagline = "Nepal’s #1 sneaker destination";

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Just Do It',
      subtitle: 'Bring inspiration and innovation to every athlete in the world',
      cta: 'Shop Now'
    },
    {
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Air Max Collection',
      subtitle: 'Step into comfort with the latest Air Max technology',
      
    },
    {
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Performance Gear',
      subtitle: 'Elevate your game with professional athletic wear',
 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToSlide(index);
    }
  };

  return (
    <section 
      className="relative h-screen overflow-hidden bg-gray-100 transition-colors duration-200"
      role="region"
      aria-label="Hero carousel"
    >
      {/* Friendly welcome and tagline */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
        {/* Removed friendlyWelcome */}
        <div className="text-lg md:text-xl text-white bg-black bg-opacity-60 px-4 py-1 rounded-full inline-block animate-fade-in-slow">
          {nepaliTagline}
        </div>
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentSlide + 1} of {slides.length}: {slides[currentSlide].title}
      </div>

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={index !== currentSlide}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-200"
            style={{ backgroundImage: `url(${slide.image})` }}
            role="img"
            aria-label={`Background image for ${slide.title}`}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30 transition-all duration-200" />
          </div>
          
          <div className="relative h-full flex items-center justify-center text-center text-white">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in text-white">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 animate-fade-in text-white">
                {slide.subtitle}
              </p>
              <button 
                className="bg-white text-black px-8 py-3 text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 animate-fade-in focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded shadow-lg hover:scale-105 active:scale-95 transform transition-transform duration-200"
                aria-label={`Browse Nepali Kicks - ${slide.title}`}
                onClick={() => navigate('/products')}
              >
                Browse Nepali Kicks 🚀
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2"
        role="tablist"
        aria-label="Carousel navigation"
      >
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
