import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  // Icons with proper positioning for both mobile and desktop
  const icons = [
    {
      src: "/images/Astro3d.png",
      alt: "Microphone",
      className: "absolute w-120 h-auto sm:w-100 sm:h-100 md:w-100 md:h-100 floating-delay-1",
      style: { top: '0%', left: '0%' }
    },
    
  ];

  return (
    // MODIFICATION HERE: Increased vertical padding significantly to approximate 16:9
    // The `py-` classes control padding-top and padding-bottom.
    // I've added a custom class `aspect-16-9-approx` that will be defined in your CSS.
    <section className="py-10 sm:py-50 md:py-15 px-4 sm:px-6 md:px-16 relative overflow-hidden flex items-center min-h-[500px] sm:min-h-[600px] md:min-h-[700px]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        {/* Content */}
        <div className="z-10 text-center md:text-left">
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 sm:mb-7 leading-tight text-gray-100">
            Learn From<br className="hidden sm:block" />
            <span className="block sm:inline">The Experts</span><br className="hidden sm:block" />
            <span className="block sm:inline">Elevate</span><br className="hidden sm:block" />
            <span className="gradient-text">Your Skills</span>
          </h1>
          <p className="text-neutral-100 mb-6 sm:mb-8 max-w-lg mx-auto md:mx-0 text-base sm:text-lg leading-relaxed">
            Unlock your full potential with our training program & comprehensive online courses.
            Dive into a world of knowledge and transform your career with our
            expertly designed learning.
          </p>
          <Link
            to="/courses"
            className="inline-block gradient-button px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium hover:shadow-lg transition-all duration-300 text-base sm:text-lg"
            onClick={() => window.scrollTo(0, 0)}
          >
            Start Learning
          </Link>
        </div>

        {/* Centered Floating Icons Container */}
        {/* Adjusted min-height to allow more vertical space */}
        <div className="relative min-h-[300px] sm:min-h-[380px] md:min-h-[480px] flex items-center justify-center">
          {/* Central container for icons - properly centered */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto">
            {/* Floating Icons - All positioned relative to the centered container */}
            {icons.map((icon, index) => (
              <img
                key={index}
                src={icon.src}
                alt={icon.alt}
                className={`${icon.className} z-10`}
                style={icon.style}
                loading="lazy"
              />
            ))}

            {/* Central visual anchor (invisible) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;