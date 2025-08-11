import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Clock, BookOpen, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import PaymentModal from '../Payment/PaymentModal';
import CourseContent from './CourseContent';
import { usePayment } from '../../hooks/usePayment';
import { useEnrollment } from '../../hooks/useEnrollment';
import { useAuth } from '../../lib/auth';

// Course data for all courses
const courseData = {
  'web-development': {
    title: 'Web Development Course',
    description: 'The Web Development course from Zyntiq is designed to provide students with comprehensive training in building dynamic and responsive websites. Covering both front-end and back-end development, this course equips students with the skills and knowledge needed to create modern web applications that meet industry standards and user expectations.',
    image: '/WebD.png',
    lectures: '100+ Lectures',
    price: 599,
    originalPrice: 2450,
    language: 'English',
    enrolled: '1,200+ Enrolled',
    features: [
      'Introduction to Web Development',
      'HTML and CSS Fundamentals',
      'JavaScript Programming',
      'Front-End Frameworks and Libraries',
      'Responsive Web Design',
      'Back-End Development',
      'Database Management',
      'Web Application Development',
      'Version Control and Deployment',
      'Web Performance Optimization'
    ]
  },
  'ui-ux-design': {
    title: 'UI/UX Design Course',
    description: 'Master the art of creating intuitive and visually appealing user interfaces. This comprehensive UI/UX Design course covers design principles, user research, wireframing, prototyping, and modern design tools to help you create exceptional user experiences.',
    image: '/UIUX.png',
    lectures: '50+ Lectures',
    price: 599,
    originalPrice: 2450,
    language: 'English',
    enrolled: '800+ Enrolled',
    features: [
      'Design Thinking Process',
      'User Research and Analysis',
      'Information Architecture',
      'Wireframing and Prototyping',
      'Visual Design Principles',
      'Color Theory and Typography',
      'Figma and Adobe XD',
      'Usability Testing',
      'Mobile-First Design',
      'Design Systems and Style Guides'
    ]
  },
  'digital-marketing': {
    title: 'Digital Marketing Course',
    description: 'Transform your business with comprehensive digital marketing strategies. Learn SEO, social media marketing, content marketing, email campaigns, and analytics to drive growth and reach your target audience effectively in the digital landscape.',
    image: '/DigitalM.png',
    lectures: '60+ Lectures',
    price: 599,
    originalPrice: 2450,
    language: 'English',
    enrolled: '950+ Enrolled',
    features: [
      'Digital Marketing Fundamentals',
      'Search Engine Optimization (SEO)',
      'Social Media Marketing',
      'Content Marketing Strategy',
      'Email Marketing Campaigns',
      'Google Ads and PPC',
      'Analytics and Data Tracking',
      'Conversion Rate Optimization',
      'Influencer Marketing',
      'Marketing Automation'
    ]
  },
  'javascript': {
    title: 'JavaScript Programming Course',
    description: 'Dive deep into JavaScript programming and become proficient in one of the most popular programming languages. Learn modern JavaScript features, DOM manipulation, asynchronous programming, and build interactive web applications.',
    image: '/JS.png',
    lectures: '80+ Lectures',
    price: 599,
    originalPrice: 2450,
    language: 'English',
    enrolled: '1,100+ Enrolled',
    features: [
      'JavaScript Fundamentals',
      'ES6+ Modern Features',
      'DOM Manipulation',
      'Event Handling',
      'Asynchronous Programming',
      'Promises and Async/Await',
      'Object-Oriented Programming',
      'Functional Programming',
      'Error Handling',
      'JavaScript Testing'
    ]
  },
  'angular': {
    title: 'Angular Framework Course',
    description: 'Master Angular, the powerful TypeScript-based framework for building dynamic web applications. Learn components, services, routing, forms, and advanced Angular concepts to create scalable enterprise applications.',
    image: '/Angular.png',
    lectures: '40+ Lectures',
    price: 599,
    originalPrice: 2450,
    language: 'English',
    enrolled: '650+ Enrolled',
    features: [
      'Angular Architecture',
      'Components and Templates',
      'Services and Dependency Injection',
      'Routing and Navigation',
      'Forms and Validation',
      'HTTP Client and APIs',
      'State Management',
      'Angular CLI',
      'Testing Angular Apps',
      'Deployment Strategies'
    ]
  },
  'chat-gpt': {
    title: 'Chat GPT & AI Course',
    description: 'Explore the world of artificial intelligence and learn how to leverage ChatGPT and other AI tools effectively. Understand AI fundamentals, prompt engineering, and practical applications in various industries.',
    image: '/AI.png',
    lectures: '25+ Lectures',
    price: 599,
    originalPrice: 2450,
    language: 'English',
    enrolled: '750+ Enrolled',
    features: [
      'AI and Machine Learning Basics',
      'Understanding ChatGPT',
      'Prompt Engineering',
      'AI Content Creation',
      'Business Applications',
      'AI Ethics and Limitations',
      'Integration with Workflows',
      'Future of AI Technology',
      'Practical Use Cases',
      'AI Tool Comparison'
    ]
  },
  'motion-design': {
    title: 'Motion Design Course',
    description: 'Learn the art of motion graphics and animation. Master industry-standard tools and techniques to create engaging animations, motion graphics, and visual effects for digital media and marketing.',
    image: '/MotionD.png',
    lectures: '45+ Lectures',
    price: 599,
    originalPrice: 2450,
    language: 'English',
    enrolled: '520+ Enrolled',
    features: [
      'Animation Principles',
      'After Effects Mastery',
      'Motion Graphics Design',
      'Character Animation',
      'Visual Effects',
      'Typography Animation',
      'Color and Composition',
      'Audio Synchronization',
      'Export and Optimization',
      'Portfolio Development'
    ]
  },
  'excel-fundamental': {
    title: 'Excel Fundamentals Course',
    description: 'Master Microsoft Excel from basics to advanced features. Learn formulas, functions, data analysis, pivot tables, and automation to boost your productivity and analytical skills in any profession.',
    image: '/Excel.png',
    lectures: '35+ Lectures',
    price: 599,
    originalPrice: 2450,
    language: 'English',
    enrolled: '900+ Enrolled',
    features: [
      'Excel Interface and Navigation',
      'Formulas and Functions',
      'Data Formatting and Validation',
      'Charts and Graphs',
      'Pivot Tables and Analysis',
      'Conditional Formatting',
      'Data Import and Export',
      'Macros and Automation',
      'Advanced Functions',
      'Business Applications'
    ]
  },
  'cyber-security': {
    title: 'Cyber Security Course',
    description: 'Protect digital assets and learn cybersecurity fundamentals. Understand threats, vulnerabilities, security protocols, and best practices to safeguard systems and data in today\'s digital world.',
    image: '/Cyber.png',
    lectures: '55+ Lectures',
    price: 599,
    originalPrice: 2450,
    language: 'English',
    enrolled: '680+ Enrolled',
    features: [
      'Cybersecurity Fundamentals',
      'Network Security',
      'Threat Assessment',
      'Incident Response',
      'Cryptography Basics',
      'Security Protocols',
      'Ethical Hacking',
      'Risk Management',
      'Compliance and Regulations',
      'Security Tools and Software'
    ]
  }
};

const CourseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState<any>(null);
  
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
    enrollments,
    loading: enrollmentLoading,
    hasPremiumPass,
    isEnrolledInCourseSync,
    getCourseEnrollment,
    updateProgress,
    refreshEnrollments
  } = useEnrollment();

  // Get course details based on courseId
  const courseDetails = courseId ? courseData[courseId as keyof typeof courseData] : null;

  // Redirect to 404 or courses page if course not found
  useEffect(() => {
    if (courseId && !courseDetails) {
      navigate('/courses');
    }
  }, [courseId, courseDetails, navigate]);

  const testimonials = [
    {
      quote: "Transformed my skills completely",
      text: "The online courses on this platform have been a game-changer for me. The content is engaging, the instructors are knowledgeable",
      name: "James",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "Incredible course, highly recommend to anyone!",
      text: "I've always wanted to explore a new skill, but never had the time or resources. This online learning platform has made it possible for me",
      name: "Will",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "The best investment I've made for my career.",
      text: "As a busy professional, the online courses on this platform have allowed me to upskill and stay ahead of the curve",
      name: "Jenny",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    }
  ];

  // Listen for enrollment updates
  useEffect(() => {
    const handleEnrollmentUpdate = () => {
      console.log('Enrollment update event received in course detail, refreshing...');
      refreshEnrollments();
    };

    window.addEventListener('enrollmentUpdated', handleEnrollmentUpdate);
    return () => window.removeEventListener('enrollmentUpdated', handleEnrollmentUpdate);
  }, [refreshEnrollments]);

  // Check enrollment status
  useEffect(() => {
    if (user && courseId && !enrollmentLoading) {
      const enrolled = isEnrolledInCourseSync(courseId);
      const courseEnrollment = getCourseEnrollment(courseId);
      
      console.log(`Course ${courseId} enrollment status:`, { enrolled, courseEnrollment, hasPremiumPass });
      
      setIsEnrolled(enrolled);
      setEnrollment(courseEnrollment);
    } else {
      setIsEnrolled(false);
      setEnrollment(null);
    }
  }, [user, courseId, enrollments, hasPremiumPass, enrollmentLoading, isEnrolledInCourseSync, getCourseEnrollment]);

  const handleEnrollClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (courseId && courseDetails) {
      initiateCoursePayment(courseId, courseDetails.title);
    }
  };

  const handleProgressUpdate = async (progress: number) => {
    if (enrollment?.id) {
      await updateProgress(enrollment.id, progress);
      setEnrollment(prev => ({ ...prev, progress }));
    }
  };

  if (enrollmentLoading) {
    return (
      <div className="min-h-screen yellow-gradient-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="min-h-screen yellow-gradient-bg flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">The course you're looking for doesn't exist.</p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
          >
            <ChevronLeft size={16} />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen yellow-gradient-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100/80 to-purple-100/80 backdrop-blur-sm py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 sm:mb-6"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{courseDetails.title}</h1>
                {isEnrolled && (
                  <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle size={16} />
                    Enrolled
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">{courseDetails.description}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
                <div className="bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-white/30">
                  <BookOpen size={16} />
                  {courseDetails.lectures}
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full text-sm border border-white/30">
                  {courseDetails.language}
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full text-sm border border-white/30">
                  {courseDetails.enrolled}
                </div>
              </div>
            </div>
            
            <div className="relative flex justify-center">
              <img
                src={courseDetails.image}
                alt={courseDetails.title}
                className="w-full max-w-xs sm:max-w-md mx-auto"
              />
              
              {!isEnrolled && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors enhanced-shadow">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-6 sm:border-t-8 border-t-transparent border-l-8 sm:border-l-12 border-l-white border-b-6 sm:border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {isEnrolled ? (
          // Show course content for enrolled users
          <CourseContent
            courseId={courseId || 'web-development'}
            courseName={courseDetails.title}
            enrollment={enrollment}
            onProgressUpdate={handleProgressUpdate}
          />
        ) : (
          // Show course preview for non-enrolled users
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">What you'll learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {courseDetails.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="glass-card-dark rounded-3xl p-4 sm:p-6 sticky top-6">
                <div className="aspect-video bg-gray-100 rounded-xl mb-4 sm:mb-6">
                  <img
                    src={courseDetails.image}
                    alt={courseDetails.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <span className="text-xl sm:text-2xl font-bold">₹{courseDetails.price}</span>
                    <span className="text-gray-400 line-through ml-2 text-sm sm:text-base">₹{courseDetails.originalPrice}</span>
                  </div>
                  <span className="text-green-500 font-medium text-sm sm:text-base">75% OFF</span>
                </div>

                <button 
                  onClick={handleEnrollClick}
                  className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-3 sm:py-4 rounded-full font-medium hover:shadow-lg transition-all duration-300 mb-3 sm:mb-4 text-base"
                >
                  {user ? 'Enroll Now' : 'Login to Enroll'}
                </button>

                <p className="text-center text-xs sm:text-sm text-gray-500">30-Day Money-Back Guarantee</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Certificate Section - Only show if not enrolled */}
      {!isEnrolled && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="glass-card rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Earn a carrier <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">certificate</span>
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
              You are encouraged to add this credential to your LinkedIn profile, résumé, or CV, and
              share it on professional networks or during performance evaluations
            </p>
          </div>
        </div>
      )}

      {/* Testimonials - Only show if not enrolled */}
      {!isEnrolled && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center sm:text-left">Featured review</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-card rounded-3xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">"{testimonial.quote}"</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  />
                  <span className="text-gray-700 text-sm sm:text-base">-{testimonial.name}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Footer Banner */}
      <div className="bg-black text-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Embrace Education,<br />
              Reach <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">New</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Elevation</span>
            </h2>
            <button className="px-6 py-3 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors text-sm sm:text-base">
              Start Learning →
            </button>
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

export default CourseDetailPage;