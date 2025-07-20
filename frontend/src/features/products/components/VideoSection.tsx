import { Video, Youtube, Volume2, VolumeX } from 'lucide-react';

const VideoSection = () => {
  return (
    <section className="py-20 bg-black text-white" role="region" aria-labelledby="video-section-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="video-section-heading" className="text-4xl font-bold mb-4">
            Just Do It
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the power of shoeNP innovation through our athletes' journeys. 
            Witness determination, dedication, and the relentless pursuit of greatness.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/XOlf3QGxbJo?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&loop=1&playlist=XOlf3QGxbJo"
              title="A People's History of the Air Jordan 1 | Jordan Brand"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: 'block', width: '100%', height: '100%' }}
            ></iframe>
          </div>

          <div id="video-description" className="sr-only">
            shoeNP brand video showcasing athletic performance and innovation
          </div>
        </div>

        {/* Video Stats */}
        <div className="flex justify-center mt-8 space-x-8 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Youtube className="h-4 w-4" aria-hidden="true" />
            <span>2.5M views</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>•</span>
            <span>Just Do It Campaign 2024</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4">Ready to Join the Movement?</h3>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Discover the gear that empowers athletes worldwide to push beyond their limits.
          </p>
          <button 
            className="bg-white text-black px-8 py-3 text-lg font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Shop shoeNP athletic collection"
          >
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
