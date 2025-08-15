// training.tsx
import { useState, useEffect } from 'react';
import './training.css';
import { useAuth } from '../../lib/auth';
import PaymentModal from '../Payment/PaymentModal';
import { PaymentData, PaymentType } from '../../lib/razorpay';
// import { PaymentResponse } from '../../types'; // Unused import

// A custom hook to centralize payment logic
const useTrainingPayment = () => {
  const { user } = useAuth();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentPaymentData, setCurrentPaymentData] = useState<PaymentData | null>(null);
  const TRAINING_PROGRAM_PRICE = 449;

  const initiateTrainingPayment = () => {
    if (!user) {
      alert('Please log in to enroll in the training program');
      window.location.href = '/login';
      return;
    }

    const paymentData: PaymentData = {
      type: PaymentType.COURSE,
      itemId: 'training-program',
      itemName: 'Corporate Training Program',
      amount: TRAINING_PROGRAM_PRICE,
      userEmail: user.email,
      userName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
      userPhone: user.phone
    };

    // Initiating training payment
    setCurrentPaymentData(paymentData);
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setCurrentPaymentData(null);
  };

  const handlePaymentSuccess = () => {
    // Payment successful
    alert('Enrollment successful! Welcome to our Corporate Training Program!');
    closePaymentModal();
  };

  return {
    isPaymentModalOpen,
    currentPaymentData,
    initiateTrainingPayment,
    closePaymentModal,
    handlePaymentSuccess,
    TRAINING_PROGRAM_PRICE
  };
};

// Hero Section Component
const HeroSection = () => {
  const { initiateTrainingPayment, isPaymentModalOpen, currentPaymentData, closePaymentModal, handlePaymentSuccess, TRAINING_PROGRAM_PRICE } = useTrainingPayment();

  const heroBackgroundStyle = {
    backgroundImage: 'linear-gradient(to right top, #222e50, #364973, #4a6597, #5c82bc, #6ebff5)'
  };

  return (
    <section className="text-white py-24 sm:py-32 lg:py-48 rounded-b-1xl shadow-xl" style={heroBackgroundStyle}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-7xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-0">
          <span className="text-white drop-shadow-md">LIVE</span>
        </h1>
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
          <span className="text-white drop-shadow-md">Training Programs</span>
        </h2>
        <p className="text-lg sm:text-xl font-light max-w-3xl mx-auto mb-10">
          Comprehensive training solutions to enhance your skills and advance your career.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a className="text-stone-50 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-gray-100">
            Get Started Today <span className="block text-sm text-amber-200 font-semibold">Few seats are left. Enroll Now!</span>
          </a>
          <button
            className="bg-gradient-to-r from-amber-300 to-indigo-300 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 flex items-center gap-2"
            onClick={initiateTrainingPayment}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            <span>Enroll Now - ₹{TRAINING_PROGRAM_PRICE}</span>
          </button>
        </div>
      </div>

      {isPaymentModalOpen && currentPaymentData && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          paymentData={currentPaymentData}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </section>
  );
};

// Program Overview Section Component
const ProgramOverview = () => {
  return (
    <section id="overview" className="bg-gray-100 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">Program Overview</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Our corporate training program is designed to transform freshers into job-ready professionals. We provide comprehensive training that covers not only technical knowledge but also the essential soft skills, professional etiquette, and strategic thinking required to excel in today's competitive corporate landscape.
        </p>
      </div>
    </section>
  );
};

// About/Introduction Section Component
const AboutSection = () => {
  return (
    <section className="bg-white py-16 sm:py-24 rounded-3xl shadow-lg -mt-16 relative z-10 mx-4 sm:mx-8 lg:mx-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">Why Our Training?</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          We go beyond textbook knowledge, focusing on the real-world skills that modern companies demand.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Feature Card 1 */}
          <div className="bg-gray-100 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 10.5h-3m3 0a.75.75 0 110-1.5.75.75 0 010 1.5zm-3 0a.75.75 0 110-1.5.75.75 0 010 1.5zm-3 0a.75.75 0 110-1.5.75.75 0 010 1.5zm-3 0a.75.75 0 110-1.5.75.75 0 010 1.5z"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Accelerate Your Career</h3>
            <p className="text-gray-500">Fast-track your professional growth with skills that matter from day one.</p>
          </div>
          {/* Feature Card 2 */}
          <div className="bg-gray-100 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 21h.01M16.5 17h-9M12 3a2.25 2.25 0 012.25 2.25V7.5a.75.75 0 00-.75.75h-3a.75.75 0 00-.75-.75V5.25A2.25 2.25 0 0112 3zM12 21a2.25 2.25 0 01-2.25-2.25V16.5a.75.75 0 00.75-.75h3a.75.75 0 00.75.75v2.25A2.25 2.25 0 0112 21z"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Innovative Curriculum</h3>
            <p className="text-gray-500">Stay ahead of the curve with a curriculum designed for the future of work.</p>
          </div>
          {/* Feature Card 3 */}
          <div className="bg-gray-100 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 100-18 9 9 0 000 18zM15 12h-6M12 9v6"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Mentorship & Support</h3>
            <p className="text-gray-500">Get guidance from industry experts and build a network that will last a lifetime.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Key Skills Section with diary and page-turning animation
const KeySkills = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const cardData = [
    { title: 'Project Management Fundamentals', description: 'Learn the basics of project planning, execution, and tracking. Understand Agile and Scrum methodologies.' },
    { title: 'Professional Writing & Reporting', description: 'Craft clear and concise emails, reports, and presentations. Learn to structure your thoughts effectively.' },
    { title: 'Corporate Communication', description: 'Develop active listening, negotiation, and public speaking skills for various business scenarios.' },
    { title: 'Interview and CV Building', description: 'Get hands-on training on how to build a powerful CV and ace your corporate interviews.' },
    { title: 'Problem-Solving & Critical Thinking', description: 'Enhance your ability to analyze complex situations and make data-driven decisions.' },
    { title: 'Digital Literacy & Tools', description: 'Become proficient in essential corporate tools like project management software, and communication platforms.' }
  ];

  const pageFlipDuration = 1000;
  const autoFlipInterval = 5000;

  useEffect(() => {
    if (!isTurning) {
      const timer = setInterval(() => {
        setIsTurning(true);
        setTimeout(() => {
          setCurrentPage((prevPage) => (prevPage + 1) % cardData.length);
          setIsTurning(false);
        }, pageFlipDuration - 100);
      }, autoFlipInterval);
      return () => clearInterval(timer);
    }
  }, [isTurning, cardData.length]);

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (isTurning) return;

    setIsTurning(true);
    setTimeout(() => {
      setCurrentPage((prevPage) => direction === 'next' ? (prevPage + 1) % cardData.length : (prevPage - 1 + cardData.length) % cardData.length);
      setIsTurning(false);
    }, pageFlipDuration - 100);
  };

  const currentCard = cardData[currentPage];
  const nextCard = cardData[(currentPage + 1) % cardData.length];

  return (
    <section className="bg-gray-100 py-16 sm:py-24 flex flex-col items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Key Areas of Focus</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our comprehensive curriculum by flipping through the pages of our digital diary.
        </p>
      </div>

      <div className="flex justify-center items-center h-[500px] mt-12 mb-12 relative w-full overflow-hidden">
        <div className="diary-container mx-auto flex">
          <div className="bg-gray-700 w-1/2 h-full rounded-l-lg shadow-xl relative z-30 flex flex-col items-center justify-center p-4 text-white">
            <img src="/images/wfavicon.svg" alt="Company Logo" className="w-12 h-auto mb-4" />
            <h2 className="text-2xl font-bold text-center">Corporate Training</h2>
          </div>

          <div className="diary-page-container">
            <div className="diary-page page-front">
              <h3 className="text-2xl font-bold mb-2 text-gray-800">{currentCard.title}</h3>
              <p className="text-gray-600 text-lg">{currentCard.description}</p>
            </div>
            <div className={`page-flip ${isTurning ? 'is-turning' : ''}`}>
              <div className="page-front-of-flip">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{currentCard.title}</h3>
                <p className="text-gray-600 text-lg">{currentCard.description}</p>
              </div>
              <div className="page-back-of-flip">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{nextCard.title}</h3>
                <p className="text-gray-600 text-lg">{nextCard.description}</p>
              </div>
            </div>
            <div className="diary-page page-back">
              <h3 className="text-2xl font-bold mb-2 text-gray-800">{nextCard.title}</h3>
              <p className="text-gray-600 text-lg">{nextCard.description}</p>
            </div>
          </div>
          <div className="spiral"></div>
        </div>
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => handlePageChange('prev')}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg transition-colors hover:bg-blue-700"
          aria-label="Previous page"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button
          onClick={() => handlePageChange('next')}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg transition-colors hover:bg-blue-700"
          aria-label="Next page"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </section>
  );
};

// Certificate Section Component
const CertificateSection = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Earn Your Certificate</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Upon successful completion of the training program, you will receive an industry-recognized certificate to showcase your new skills.
        </p>
        <div className="flex justify-center">
          {/* This is a placeholder for your certificate image. 
              You can replace the src attribute with the URL of your actual certificate design. */}
          <img
            src="images\demo cert.png" // Replace with your image path
            alt="Certificate of Completion"
            className="w-full max-w-2xl rounded-xl shadow-2xl transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

// Testimonial Section Component
const TestimonialSection = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      college: 'Delhi University',
      comment: "The training was a game-changer for me. I learned so much about workplace communication and project management that I use every day in my new job."
    },
    {
      name: 'Rohan Gupta',
      college: 'IIT Bombay',
      comment: "The resume-building and mock interview sessions were invaluable. I felt so much more confident walking into my interviews after this program."
    },
    {
      name: 'Ananya Singh',
      college: 'Mumbai University',
      comment: "This program helped me bridge the gap between my academic knowledge and what the corporate world actually expects. Highly recommended!"
    },
    {
      name: 'Vikram Patel',
      college: 'Anna University',
      comment: "The hands-on projects were the best part. They gave me practical experience that made my resume stand out from the rest."
    },
    {
      name: 'Meera Das',
      college: 'Jadavpur University',
      comment: "The expert-led workshops were fantastic. I learned strategic thinking skills that I never thought I'd get from a training program."
    }
  ];

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">What Our Trainees Say</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Hear from the freshers who successfully transitioned into the corporate world with our help.
        </p>
        <div className="overflow-hidden relative">
          <div className="flex animate-scroll-testimonials whitespace-nowrap">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={index} className="bg-gray-100 p-8 rounded-xl shadow-md mx-4 w-80 sm:w-96 flex-shrink-0">
                <p className="text-gray-700 mb-4 italic whitespace-normal">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <img
                    src={`https://placehold.co/60x60/c7d2fe/374151?text=${testimonial.name.split(' ').map(n => n[0]).join('')}`}
                    alt={`Profile picture of trainee ${testimonial.name}`}
                    className="w-12 h-12 rounded-full mr-4 shadow-md"
                  />
                  <div className="text-left">
                    <p className="font-bold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Video Collage Section Component
const VideoCollageSection = () => {
  const videos = [
    { url: "https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&modestbranding=1&rel=0", title: "Project Management" },
    { url: "https://www.youtube.com/embed/o-YUD8y_7kI?controls=1&modestbranding=1&rel=0", title: "Effective Communication" },
    { url: "https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&modestbranding=1&rel=0", title: "Leadership Skills" },
    { url: "https://www.youtube.com/embed/o-YUD8y_7kI?controls=1&modestbranding=1&rel=0", title: "Team Collaboration" },
    { url: "https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&modestbranding=1&rel=0", title: "Problem Solving" }
  ];

  return (
    <section className="bg-gray-100 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Video Highlights</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Watch a selection of our training videos and get a feel for our comprehensive curriculum.
        </p>
        <div className="overflow-hidden p-4 rounded-xl shadow-inner bg-gray-200">
          <div className="flex space-x-4 animate-auto-scroll-videos">
            {[...videos, ...videos].map((video, index) => (
              <div key={index} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
                <div className="relative w-full pb-[177.77%]">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={video.url}
                    title={`Video highlight: ${video.title}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Call to Action Section Component
const CallToAction = () => {
  const { initiateTrainingPayment, isPaymentModalOpen, currentPaymentData, closePaymentModal, handlePaymentSuccess, TRAINING_PROGRAM_PRICE } = useTrainingPayment();

  return (
    <section id="enroll" className="bg-[conic-gradient(var(--tw-gradient-stops))] from-pink-100 via-cyan-700 to-amber-50  py-16 sm:py-24 rounded-t-4xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-blue-950">Ready to Start Your Journey?</h2>
        <p className="text-blue-900 max-w-2xl mx-auto mb-8">
          Don't wait. Empower your career with the skills employers are looking for.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a href="/contact" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-gray-100">
            Join Our Next Batch
          </a>
          <button
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 flex items-center gap-2"
            onClick={initiateTrainingPayment}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            <span>Enroll Now - ₹{TRAINING_PROGRAM_PRICE}</span>
          </button>
        </div>
      </div>

      {isPaymentModalOpen && currentPaymentData && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          paymentData={currentPaymentData}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </section>
  );
};

// Payment Section Component (unused - kept for reference)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PaymentSection = () => {
  const { initiateTrainingPayment, isPaymentModalOpen, currentPaymentData, closePaymentModal, handlePaymentSuccess, TRAINING_PROGRAM_PRICE } = useTrainingPayment();

  return (
    <section id="payment-section" className="bg-gray-100 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Enroll in Our Training Program</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Secure your spot in our upcoming batch and start your journey towards professional excellence.
        </p>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Corporate Training Program</h3>
              <p className="text-gray-600">Comprehensive professional skills training</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-violet-600">₹{TRAINING_PROGRAM_PRICE}</p>
              <p className="text-sm text-gray-500 line-through">₹1999</p>
              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">78% OFF</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700">Live interactive sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700">Hands-on projects & assignments</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700">Certificate of completion</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-700">Job placement assistance</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">Limited seats available</p>
                <p className="text-xs text-yellow-700">Batch starting soon. Enroll now to secure your spot.</p>
              </div>
            </div>
          </div>

          <button
            onClick={initiateTrainingPayment}
            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            Enroll Now - Pay ₹{TRAINING_PROGRAM_PRICE}
          </button>
        </div>
      </div>

      {isPaymentModalOpen && currentPaymentData && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          paymentData={currentPaymentData}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </section>
  );
};

// Main Training Component
const Training = () => {
  return (
    <div className="antialiased font-sans">
      <HeroSection />
      <ProgramOverview />
      <AboutSection />
      <KeySkills />
      <CertificateSection />
      <TestimonialSection />
      <VideoCollageSection />
      <CallToAction />
    </div>
  );
};

export default Training;