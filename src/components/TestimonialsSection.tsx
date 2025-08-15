import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// This is the main App component that renders the TestimonialsSection.
const App = () => {
  return (
    // The main container for the app, with Tailwind classes for full-screen display
    // and a pleasant background.
    <div className="linear-gradient(to bottom right, #1b2430, #51557e, #816797); min-h-screen flex items-center justify-center p-4">
      <TestimonialsSection />
    </div>
  );
};

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Here is the testimonials data array. This is where you can change the avatar images.
  // Simply replace the URL string for the 'avatar' property with your own image URL.
  // For example: avatar: "https://your-website.com/path-to-your-image.jpg"
  const testimonials = [
    {
      quote: "Transformed my web design skills completely",
      text: "The online courses on this platform have been a game changer for me. The content is engaging, the instructors are knowledgeable, and the practical projects helped me build a strong portfolio.",
      name: "James",
      role: "Frontend Developer",
      avatar: "https://placehold.co/100x100/A855F7/FFFFFF?text=J" // Placeholder, replace this with your image URL
    },
    {
      quote: "Incredible course, highly recommend to anyone!",
      text: "I've always wanted to explore a new skill, but never had the time or resources. This online learning platform has made it possible for me to learn at my own pace and achieve my goals.",
      name: "Will",
      role: "UI/UX Designer",
      avatar: "https://placehold.co/100x100/EC4899/FFFFFF?text=W" // Placeholder, replace this with your image URL
    },
    {
      quote: "The best investment I've made for my career.",
      text: "As a busy professional, the online courses on this platform have allowed me to upskill and stay ahead of the curve. The flexibility and quality of content is unmatched.",
      name: "Jenny",
      role: "Digital Marketer",
      avatar: "https://placehold.co/100x100/3B82F6/FFFFFF?text=J" // Placeholder, replace this with your image URL
    },
    {
      quote: "Outstanding learning experience with real results",
      text: "The structured curriculum and hands-on projects gave me the confidence to switch careers. Within 6 months, I landed my dream job in tech. Highly recommended!",
      name: "Sarah",
      role: "Software Engineer",
      avatar: "https://placehold.co/100x100/F97316/FFFFFF?text=S" // Placeholder, replace this with your image URL
    },
    {
      quote: "Perfect blend of theory and practical application",
      text: "What sets this platform apart is the practical approach to learning. Every concept is backed by real-world examples and projects that you can add to your portfolio.",
      name: "Michael",
      role: "Full Stack Developer",
      avatar: "https://placehold.co/100x100/10B981/FFFFFF?text=M" // Placeholder, replace this with your image URL
    },
    {
      quote: "Exceeded all my expectations",
      text: "The quality of instruction and the support from the community made learning enjoyable and effective. I've completed 3 courses and each one has added tremendous value to my skill set.",
      name: "Emma",
      role: "Product Manager",
      avatar: "https://placehold.co/100x100/EAB308/FFFFFF?text=E" // Placeholder, replace this with your image URL
    }
  ];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate how many testimonials to show
  const testimonialsPerView = isMobile ? 1 : 3;
  const totalSlides = testimonials.length - testimonialsPerView + 1;

  const nextTestimonial = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setActiveIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= totalSlides ? 0 : nextIndex;
    });
    
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, totalSlides]);

  // Auto-slide functionality - ENABLED for both mobile and desktop
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextTestimonial();
      }
    }, 4000); // Changed to 4 seconds for better mobile experience

    return () => clearInterval(interval);
  }, [activeIndex, isAnimating, nextTestimonial]);

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setActiveIndex((prevIndex) => {
      return prevIndex === 0 ? totalSlides - 1 : prevIndex - 1;
    });
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === activeIndex || index >= totalSlides) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Get visible testimonials
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < testimonialsPerView; i++) {
      const index = activeIndex + i;
      if (index < testimonials.length) {
        visible.push(testimonials[index]);
      }
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section className="py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-stone-50 px-4">
            What are Students saying<br className="sm:hidden" /> 
            <span className="block sm:inline mt-2 sm:mt-0"> about </span>
            <span className="text-purple-600">our Courses</span>
          </h2>
          <p className="text-violet-200 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Join thousands of successful learners who have transformed their careers with our comprehensive courses.
          </p>
        </div>
        
        {/* Testimonials Container */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'} gap-4 sm:gap-6 md:gap-8 transition-all duration-500 ease-in-out ${
                isAnimating ? 'transform scale-95 opacity-80' : 'transform scale-100 opacity-100'
              }`}
            >
              {visibleTestimonials.map((testimonial, index) => (
                <div 
                  key={`${activeIndex}-${index}`} 
                  className={`testimonial-card group ${
                    isAnimating ? 'animate-pulse' : 'animate-in fade-in slide-in-from-bottom duration-500'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-50 transition-opacity">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12 text-teal-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-base sm:text-lg font-bold text-center mb-3 sm:mb-4 text-gray-900 group-hover:text-slate-800 transition-colors line-clamp-2">
                      "{testimonial.quote}"
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6 leading-relaxed line-clamp-3">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center mt-auto">
                      <div className="relative">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name} 
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 border-2 border-white shadow-lg group-hover:border-purple-300 transition-colors"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">-{testimonial.name}</p>
                        <p className="text-xs text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 gap-4">
          {/* Pagination Dots */}
          <div className="flex-grow flex justify-center gap-2 sm:gap-3 order-2 sm:order-1">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isAnimating}
                className={`transition-all duration-300 rounded-full ${
                  index === activeIndex
                    ? 'w-8 sm:w-12 h-3 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'
                    : 'w-3 h-3 bg-gray-400 hover:bg-gray-500'
                } disabled:opacity-50`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Arrow Navigation */}
          <div className="flex gap-2 sm:gap-3 order-1 sm:order-2">
            <button 
              onClick={prevTestimonial}
              disabled={isAnimating}
              className="group w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 backdrop-blur-sm"
              aria-label="Previous testimonials"
            >
              <ChevronLeft 
                size={isMobile ? 16 : 20} 
                className="text-gray-600 group-hover:text-purple-600 transition-colors" 
              />
            </button>
            <button 
              onClick={nextTestimonial}
              disabled={isAnimating}
              className="group w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 backdrop-blur-sm"
              aria-label="Next testimonials"
            >
              <ChevronRight 
                size={isMobile ? 16 : 20} 
                className="text-gray-600 group-hover:text-purple-600 transition-colors" 
              />
            </button>
          </div>
        </div>

        {/* Progress Indicator - Minimal bottom margin */}
        <div className="mt-1 sm:mt-2 text-center">
          <span className="text-xs sm:text-sm text-slate-200">
            Showing {activeIndex + 1}-{Math.min(activeIndex + testimonialsPerView, testimonials.length)} of {testimonials.length} testimonials
          </span>
        </div>
      </div>
    </section>
  );
};

export default App;
