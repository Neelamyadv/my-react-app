import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PaymentModal from '../Payment/PaymentModal';
import { usePayment } from '../../hooks/usePayment';
import { useEnrollment } from '../../hooks/useEnrollment';
import { useAuth } from '../../lib/auth';
import { PaymentType } from '../../types/payment';

const topCourses = [
  {
    id: 'web-development',
    title: 'Web Development',
    image: '/WebD.png',
    lectures: '100+ Lectures',
    hours: '4+ Hours',
    description: 'Build the web, Shape the future - Learn to Code Like a Pro',
    price: 599,
    originalPrice: 2450,
    badge: 'EXCLUSIVE LECTURES',
    color: 'from-purple-500 to-indigo-700',
    ebookPrice: 299,
    ebookAvailable: true
  },
  {
    id: 'javascript',
    title: 'Java Script Programming',
    image: '/JS.png',
    lectures: '20+ Lectures',
    hours: '4+ Hours',
    description: 'Build the web, Shape the future - Learn to Code Like a Pro',
    price: 599,
    originalPrice: 2450,
    badge: 'DEVELOP YOUR TECHNICAL DISTINCT',
    color: 'from-indigo-500 to-purple-600',
    ebookPrice: 299,
    ebookAvailable: true
  },
  {
    id: 'angular',
    title: 'Angular Framework',
    image: '/Angular.png',
    lectures: '12+ Lectures',
    hours: '2+ Hours',
    description: 'Transform Your Business: Digital Marketing Strategies That Work',
    price: 599,
    originalPrice: 2450,
    badge: 'CREATIVE COURSE',
    color: 'from-purple-500 to-pink-600',
    ebookPrice: 299,
    ebookAvailable: true
  },
  {
    id: 'chat-gpt',
    title: 'Chat GPT',
    image: '/AI.png',
    lectures: '5+ Lectures',
    hours: '1+ Hours',
    description: 'Build the web, Shape the future - Learn to Code Like a Pro',
    price: 599,
    originalPrice: 2450,
    badge: 'ARTIFICIAL INTELLIGENCE COURSE',
    color: 'from-indigo-600 to-purple-800',
    ebookPrice: 299,
    ebookAvailable: true
  }
];

const allCourses = [
  {
    id: 'web-development',
    title: 'Web Development',
    image: '/WebD.png',
    lectures: '100+ Lectures',
    hours: '4+ Hours',
    description: 'Build the web, Shape the future - Learn to Code Like a Pro',
    price: 599,
    originalPrice: 2450,
    ebookPrice: 299,
    ebookAvailable: true
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    image: '/DigitalM.png',
    lectures: '12+ Lectures',
    hours: '2+ Hours',
    description: 'Transform Your Business: Digital Marketing Strategies That Work',
    price: 599,
    originalPrice: 2450,
    ebookPrice: 299,
    ebookAvailable: true
  },
  {
    id: 'chat-gpt',
    title: 'Chat GPT (AI)',
    image: '/AI.png',
    lectures: '5+ Lectures',
    hours: '1+ Hours',
    description: 'Build the web, Shape the future - Learn to Code Like a Pro',
    price: 599,
    originalPrice: 2450,
    ebookPrice: 299,
    ebookAvailable: true
  },
  {
    id: 'motion-design',
    title: 'Motion Design',
    image: '/MotionD.png',
    lectures: '10+ Lectures',
    hours: '4+ Hours',
    description: 'Build the web, Shape the future - Learn to Code Like a Pro',
    price: 599,
    originalPrice: 2450,
    ebookPrice: 299,
    ebookAvailable: true
  },
  {
    id: 'excel-fundamental',
    title: 'Excel Fundamental',
    image: '/Excel.png',
    lectures: '20+ Lectures',
    hours: '2+ Hours',
    description: 'Transform Your Business: Digital Marketing Strategies That Work',
    price: 599,
    originalPrice: 2450,
    ebookPrice: 299,
    ebookAvailable: true
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    image: '/UIUX.png',
    lectures: '10+ Lectures',
    hours: '2+ Hours',
    description: 'Build the web, Shape the future - Learn to Code Like a Pro',
    price: 599,
    originalPrice: 2450,
    ebookPrice: 299,
    ebookAvailable: true
  },
  {
    id: 'javascript',
    title: 'Java Script Programing',
    image: 'JS.png',
    lectures: '20+ Lectures',
    hours: '4+ Hours',
    description: 'Build the web, Shape the future - Learn to Code Like a Pro',
    price: 599,
    originalPrice: 2450,
    ebookPrice: 299,
    ebookAvailable: true
  },
  {
    id: 'angular',
    title: 'Angular Framework',
    image: '/Angular.png',
    lectures: '12+ Lectures',
    hours: '2+ Hours',
    description: 'Transform Your Business: Digital Marketing Strategies That Work',
    price: 599,
    originalPrice: 2450,
    ebookPrice: 299,
    ebookAvailable: true
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security',
    image: '/Cyber.png',
    lectures: '5+ Lectures',
    hours: '1+ Hours',
    description: 'Build the web, Shape the future - Learn to Code Like a Pro',
    price: 599,
    originalPrice: 2450,
    ebookPrice: 299,
    ebookAvailable: true
  }
];

const CourseCard = ({ course, isTopCourse = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { initiateCoursePayment } = usePayment();

  const handleEbookPurchase = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    const paymentData = {
      type: PaymentType.EBOOK,
      itemId: course.id,
      itemName: `${course.title} - eBook`,
      amount: course.ebookPrice || 299,
      userEmail: user.email,
      userName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
      userPhone: user.phone
    };

    initiateCoursePayment(paymentData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Course Image */}
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        {isTopCourse && course.badge && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {course.badge}
            </span>
          </div>
        )}
        {course.ebookAvailable && (
          <div className="absolute top-4 right-4">
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              📖 eBook Ready
            </span>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{course.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {course.lectures}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.hours}
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">₹{course.price}</span>
            <span className="text-sm text-gray-500 line-through ml-2">₹{course.originalPrice}</span>
          </div>
          {course.ebookAvailable && (
            <div className="text-right">
              <span className="text-lg font-bold text-green-600">₹{course.ebookPrice}</span>
              <span className="text-xs text-green-600 block">eBook Only</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/courses/${course.id}`)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
          >
            View Details
          </button>
          {course.ebookAvailable && (
            <button
              onClick={handleEbookPurchase}
              className="bg-green-500 text-white py-2 px-4 rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              📖 Buy eBook
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CoursesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Payment integration
  const {
    isPaymentModalOpen,
    currentPaymentData,
    initiateCoursePayment,
    closePaymentModal,
    handlePaymentSuccess
  } = usePayment();

  // Enrollment integration
  const {
    loading: enrollmentLoading,
    isEnrolledInCourseSync,
    refreshEnrollments
  } = useEnrollment();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for enrollment updates
  useEffect(() => {
    const handleEnrollmentUpdate = () => {
      // Enrollment update event received, refreshing...
      refreshEnrollments();
    };

    window.addEventListener('enrollmentUpdated', handleEnrollmentUpdate);
    return () => window.removeEventListener('enrollmentUpdated', handleEnrollmentUpdate);
  }, [refreshEnrollments]);

  // Auto-slide functionality (disabled on mobile for better performance)
  useEffect(() => {
    if (!isAutoPlaying || isMobile) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topCourses.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isMobile]);

  const handleCourseClick = (courseId: string) => {
    window.scrollTo(0, 0);
    navigate(`/courses/${courseId}`);
  };

  const handleEnrollClick = (e: React.MouseEvent, courseId: string, courseName: string) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    initiateCoursePayment(courseId, courseName);
  };

  const isEnrolledInCourse = (courseId: string): boolean => {
    if (enrollmentLoading) return false;
    return isEnrolledInCourseSync(courseId);
  };

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % topCourses.length);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + topCourses.length) % topCourses.length);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const handlePremiumPassExplore = () => {
    window.scrollTo(0, 0);
    navigate('/premium-pass');
  };

  return (
    <div className="min-h-screen yellow-gradient-bg">
      {/* Hero Section with Welcome Background */}
      <div className="relative overflow-hidden">
        {/* Welcome Background Text - Hidden on mobile */}
        <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
          <div className="text-[15rem] lg:text-[20rem] font-bold text-yellow-200/20 select-none whitespace-nowrap">
            Welcome
          </div>
        </div>

        {/* Floating decorative elements - Reduced on mobile */}
        <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-8 h-8 sm:w-16 sm:h-16 bg-yellow-300/60 rounded-2xl opacity-60"></div>
        <div className="absolute bottom-20 sm:bottom-40 left-10 sm:left-20 w-10 h-10 sm:w-20 sm:h-20 bg-yellow-400/50 rounded-full opacity-40"></div>
        <div className="absolute top-1/2 right-1/4 w-6 h-6 sm:w-12 sm:h-12 bg-yellow-500/60 rounded-xl opacity-50"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* Breadcrumb */}
          

          {/* Popular Courses Section */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-50 text-center sm:text-left">Popular Courses</h2>
            
            <div className="relative max-w-5xl mx-auto">
              {/* Slider Container */}
              <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {topCourses.map((course, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div 
                        className={`relative bg-gradient-to-r ${course.color} rounded-2xl sm:rounded-3xl p-4 sm:p-8 cursor-pointer hover:scale-[1.02] transition-all duration-300 enhanced-shadow-lg`}
                        onClick={() => handleCourseClick(course.id)}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center">
                          {/* Left Content */}
                          <div className="text-white text-center md:text-left">
                            <div className="inline-block bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                              {course.badge}
                            </div>
                            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">{course.title}</h3>
                            <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed">{course.description}</p>
                            
                            <div className="flex items-center justify-center md:justify-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm sm:text-base">{course.lectures}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm sm:text-base">{course.hours}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4">
                              <span className="text-xl sm:text-2xl lg:text-3xl font-bold">₹{course.price}</span>
                              <span className="text-white/70 line-through text-base sm:text-lg lg:text-xl">₹{course.originalPrice}</span>
                              <span className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                                75% OFF
                              </span>
                            </div>
                          </div>

                          {/* Right Image */}
                          <div className="relative order-first md:order-last">
                            <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden enhanced-shadow">
                              <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* Play button overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                <div className="w-0 h-0 border-t-4 sm:border-t-6 border-t-transparent border-l-6 sm:border-l-10 border-l-gray-800 border-b-4 sm:border-b-6 border-b-transparent ml-1"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows - Hidden on mobile */}
              {!isMobile && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center enhanced-shadow hover:bg-white hover:scale-110 transition-all z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center enhanced-shadow hover:bg-white hover:scale-110 transition-all z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                {topCourses.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-purple-600 w-6 sm:w-8' 
                        : 'bg-gray-400 hover:bg-gray-500 w-2 sm:w-3'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* eBook Bundle Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              📖 Complete Course eBook Bundle
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get instant access to all 9 course eBooks at a massive discount! 
              Perfect for self-paced learning and offline study.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-8 text-white text-center">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                All 9 Course eBooks
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Web Development, JavaScript, Angular, Chat GPT, Digital Marketing, 
                Motion Design, Excel, UI/UX Design, and Cyber Security
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-4xl font-bold">₹799</span>
                <span className="text-xl line-through opacity-75">₹2,691</span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  70% OFF
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                {allCourses.slice(0, 8).map((course) => (
                  <div key={course.id} className="bg-white/10 rounded-xl p-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium">{course.title}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  
                  const paymentData = {
                    type: PaymentType.EBOOK_BUNDLE,
                    itemId: 'ebook-bundle',
                    itemName: 'Complete Course eBook Bundle',
                    amount: 799,
                    userEmail: user.email,
                    userName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
                    userPhone: user.phone
                  };
                  
                  initiateCoursePayment(paymentData);
                }}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Buy All eBooks - ₹799
              </button>
            </div>
          </div>
        </div>

        {/* Individual Courses Section */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
            Individual Course eBooks
          </h2>
          <p className="text-lg text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Choose specific courses that interest you. Each eBook includes comprehensive 
            course material, examples, and practical exercises.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((course, index) => {
              const enrolled = isEnrolledInCourse(course.id);
              
              return (
                <CourseCard 
                  key={index} 
                  course={course} 
                  isTopCourse={false}
                />
              );
            })}
          </div>
        </div>

        {/* Premium Pass Banner - Mobile Optimized with BIGGER LOGO */}
        <div className="mt-12 sm:mt-16 relative overflow-hidden rounded-2xl sm:rounded-3xl">
          {/* Purple gradient background */}
          <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative">
            {/* Organic shapes background - Reduced on mobile */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Large organic shapes */}
              <div className="absolute -top-10 sm:-top-20 -right-10 sm:-right-20 w-40 sm:w-80 h-40 sm:h-80 bg-purple-600/30 rounded-full"></div>
              <div className="absolute -bottom-16 sm:-bottom-32 -left-16 sm:-left-32 w-48 sm:w-96 h-48 sm:h-96 bg-purple-600/20 rounded-full"></div>
              <div className="absolute top-1/2 right-1/4 w-20 sm:w-40 h-20 sm:h-40 bg-purple-500/25 rounded-full"></div>
              
              {/* Smaller decorative shapes - Hidden on mobile */}
              <div className="hidden sm:block absolute top-20 left-1/4 w-16 h-16 bg-purple-400/30 rounded-2xl transform rotate-45"></div>
              <div className="hidden sm:block absolute bottom-20 right-1/3 w-12 h-12 bg-purple-300/40 rounded-full"></div>
              <div className="hidden sm:block absolute top-1/3 left-1/6 w-8 h-8 bg-purple-200/50 rounded-lg"></div>
            </div>
            
            <div className="relative z-10 p-6 sm:p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
                {/* Left Content */}
                <div className="text-white text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-4 sm:mb-6">
                    {/* BIGGER ZYNTIQ LOGO */}
                    <img 
                      src="images\whitelogomain.png" 
                      alt="Zyntiq Logo" 
                      className="h-10 sm:h-14 md:h-18 lg:h-15 xl:h-18 w-auto object-contain"
                    />
                    <div className="flex items-center gap-2 bg-purple-600/50 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-xs sm:text-sm font-medium">Premium Pass</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
                    <li className="flex items-center justify-center md:justify-start gap-3">
                      <div className="w-2 h-2 bg-purple-300 rounded-full flex-shrink-0"></div>
                      <span>Access to 13+ In-Depth Courses</span>
                    </li>
                    <li className="flex items-center justify-center md:justify-start gap-3">
                      <div className="w-2 h-2 bg-purple-300 rounded-full flex-shrink-0"></div>
                      <span>Lifetime Access</span>
                    </li>
                    <li className="flex items-center justify-center md:justify-start gap-3">
                      <div className="w-2 h-2 bg-purple-300 rounded-full flex-shrink-0"></div>
                      <span>Free access to all future courses</span>
                    </li>
                    <li className="flex items-center justify-center md:justify-start gap-3">
                      <div className="w-2 h-2 bg-purple-300 rounded-full flex-shrink-0"></div>
                      <span>Exclusive eBook</span>
                    </li>
                    <li className="flex items-center justify-center md:justify-start gap-3">
                      <div className="w-2 h-2 bg-purple-300 rounded-full flex-shrink-0"></div>
                      <span>and lot <span className="font-semibold">more</span></span>
                    </li>
                  </ul>
                  
                  <div className="flex justify-center md:justify-start">
                    <button 
                      onClick={handlePremiumPassExplore}
                      className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white/30 transition-all duration-300 font-medium text-sm sm:text-base"
                    >
                      <span>Explore</span>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/30 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Right Illustration */}
                <div className="flex justify-center relative order-first md:order-last">
                  {/* Circular background for illustration */}
                  <div className="w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-purple-300/20 to-indigo-300/20 rounded-full flex items-center justify-center relative">
                    {/* Graduation cap illustration */}
                    <div className="relative">
                      <img
                        src="images\Win.png"
                        alt="Graduation Cap"
                        className="w-32 h-32 sm:w-48 sm:h-48 object-contain"
                      />
                      {/* Additional decorative elements around the cap */}
                      <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-4 h-4 sm:w-8 sm:h-8 bg-yellow-400 rounded-full opacity-80"></div>
                      <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-3 h-3 sm:w-6 sm:h-6 bg-orange-400 rounded-full opacity-70"></div>
                      <div className="absolute top-1/2 -right-4 sm:-right-8 w-2 h-2 sm:w-4 sm:h-4 bg-red-400 rounded-full opacity-60"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="bg-black text-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Embrace Education,<br />
              Reach <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">New</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Elevation</span>
            </h2>
            <Link 
              to="/courses"
              onClick={() => window.scrollTo(0, 0)}
              className="px-6 sm:px-8 py-3 bg-purple-500 rounded-full hover:bg-purple-600 transition-colors font-medium flex items-center gap-2 text-sm sm:text-base"
            >
              Start Learning
              <span className="text-lg sm:text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {currentPaymentData && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          paymentData={currentPaymentData}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default CoursesPage;