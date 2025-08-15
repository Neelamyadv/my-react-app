import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

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
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Smart</span>
            <br />
            Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Fast</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Master in-demand skills with our comprehensive courses, live training, and professional certifications
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate('/courses')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Explore Courses
            </button>
            
            <button
              onClick={() => navigate('/ebooks')}
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              📚 eBook Store
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Instant Access</span>
            </button>
          </div>
          
          <p className="text-gray-400 text-sm">
            Join 10,000+ students already learning with Zyntiq
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;