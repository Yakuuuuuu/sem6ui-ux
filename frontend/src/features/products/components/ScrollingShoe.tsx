
import { useState, useEffect } from 'react';

const ScrollingShoe = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Show the shoe after scrolling 100px
      setIsVisible(currentScrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate rotation based on scroll position
  const rotation = scrollY * 0.3;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5"
        style={{
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(2)`,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Background rotating shoe"
          className="w-96 h-96 object-contain"
        />
      </div>
    </div>
  );
};

export default ScrollingShoe;
