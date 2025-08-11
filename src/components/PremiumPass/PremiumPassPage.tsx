import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, GraduationCap, Clock, BookOpen, Award, Crown, CheckCircle } from 'lucide-react';
import CountUp from 'react-countup';
import PaymentModal from '../Payment/PaymentModal';
import { usePayment } from '../../hooks/usePayment';
import { useEnrollment } from '../../hooks/useEnrollment';
import { useAuth } from '../../lib/auth';

const PremiumPassPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPremiumPass, enrollments } = useEnrollment();
  
  // Payment integration
  const {
    isPaymentModalOpen,
    currentPaymentData,
    initiatePremiumPassPayment,
    closePaymentModal,
    handlePaymentSuccess
  } = usePayment();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePurchaseClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    initiatePremiumPassPayment();
  };

  const handleExploreCourses = () => {
    window.scrollTo(0, 0);
    navigate('/courses');
  };

  // Get premium pass enrollment details
  const premiumEnrollment = enrollments.find(e => e.enrollment_type === 'premium_pass');

  return (
    <div className="min-h-screen yellow-gradient-bg text-gray-800">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors mb-8 sm:mb-12 min-h-[44px]">
          <ChevronLeft size={20} />
          <span className="text-sm sm:text-base">Back</span>
        </Link>

        {/* Logo and Title - Made Logo Much Larger */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img 
              src="/Frame 3.png" 
              alt="Zyntiq Logo" 
              className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto object-contain"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Premium Pass</h2>
            <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
          </div>
        </div>

        {/* Premium Status Banner */}
        {hasPremiumPass && (
          <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center enhanced-shadow-lg">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Crown className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Premium Member</h3>
              </div>
              <p className="text-white/90 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                🎉 Congratulations! You have unlimited access to all courses and premium benefits.
              </p>
              {premiumEnrollment && (
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <p className="text-white font-medium text-sm sm:text-base">
                    Member since: {new Date(premiumEnrollment.enrolled_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
              <button 
                onClick={handleExploreCourses}
                className="bg-white text-orange-600 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base min-h-[48px]"
              >
                Explore Your Courses
              </button>
            </div>
          </div>
        )}

        {/* Introduction */}
        {!hasPremiumPass && (
          <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-24 glass-card-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              We're excited to introduce our newest course bundle, created to elevate your learning experience! Unlock a world of knowledge with our all-in-one package, thoughtfully designed to equip you with the expertise and confidence you need to thrive. More details coming soon on how you can take advantage of this exceptional opportunity!
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-3xl mx-auto mb-16 sm:mb-24">
          <div className="glass-card-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-gray-800">
              <CountUp end={100} suffix="+" duration={2.5} />
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Members</p>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 leading-tight">Join the community with 1000+ students and excel!</p>
          </div>
          <div className="glass-card-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-gray-800">
              <CountUp end={1} prefix="0" suffix="+" duration={2.5} />
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Hours</p>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 leading-tight">Get access to every bit of our content</p>
          </div>
          <div className="glass-card-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-gray-800">
              <CountUp end={10} suffix="+" duration={2.5} />
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Lectures</p>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 leading-tight">Watch 100+ well-paced lecture at your comfort</p>
          </div>
        </div>

        {/* Premium Benefits for Existing Members */}
        {hasPremiumPass && (
          <div className="max-w-4xl mx-auto mb-16 sm:mb-24">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">Your Premium Benefits</h3>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="glass-card-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800">Unlimited Course Access</h4>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Access to all 13+ current courses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Free access to all future courses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Lifetime access guarantee</span>
                  </li>
                </ul>
              </div>

              <div className="glass-card-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800">Premium Features</h4>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Priority customer support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Exclusive eBooks and resources</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Early access to new courses</span>
                  </li>
                </ul>
              </div>

              <div className="glass-card-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800">Certification Benefits</h4>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Verified certificates for all courses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">LinkedIn integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Industry recognition</span>
                  </li>
                </ul>
              </div>

              <div className="glass-card-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800">Exclusive Access</h4>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Zyntiq Academy membership</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Premium community access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">Monthly live sessions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Features for Non-Premium Users */}
        {!hasPremiumPass && (
          <div className="max-w-4xl mx-auto glass-card-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mb-16 sm:mb-24">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Left Column - Pricing */}
              <div>
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Join</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-800">₹999</span>
                    <span className="text-base sm:text-lg text-gray-500 line-through">₹4999</span>
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-medium">80% OFF</span>
                  </div>
                </div>

                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm sm:text-base">Lifetime Access To Verified Certificates.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm sm:text-base">100+ New Courses Coming in 2025.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm sm:text-base">Enjoy Unlimited Learning with Full course Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm sm:text-base">Complimentary Entry to Zyntiq Academy.</span>
                  </li>
                </ul>

                <div className="space-y-3 sm:space-y-4">
                  <div className="w-full py-2 rounded-full bg-green-500 text-center font-medium text-white text-sm sm:text-base">
                    Save 80% - Limited Time Offer!
                  </div>
                  <button 
                    onClick={handlePurchaseClick}
                    className="w-full py-3 sm:py-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg transition-all duration-300 font-semibold text-sm sm:text-base min-h-[48px]"
                  >
                    {user ? 'Get Premium Pass' : 'Login to Purchase'}
                  </button>
                </div>
              </div>

              {/* Right Column - Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 text-purple-600" />
                  <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">14+ Courses</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Access a diverse selection of professionally developed, live and recorded courses designed to enhance your skill set and career prospects.</p>
                </div>
                <div>
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 text-purple-600" />
                  <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">Lifetime Access</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Benefit from unlimited, lifetime access to over 14 practical courses, available anytime at your convenience.</p>
                </div>
                <div>
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 text-purple-600" />
                  <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">Certified Programs</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">All Zyntiq courses include certification, providing you with recognized credentials to strengthen your professional profile.</p>
                </div>
                <div>
                  <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 text-purple-600" />
                  <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">Zyntiq Academy</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">A meticulously curated academic platform aimed at supporting students in their career preparation with comprehensive study materials.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Section */}
        <div className="max-w-4xl mx-auto mb-16 sm:mb-24">
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-12 text-gray-800">Why Invest in Professional Certificate?</h3>
          
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="order-2 lg:order-1">
              <img 
                src="images/certificate.png" 
                alt="Sample Certificate" 
                className="w-full rounded-xl sm:rounded-2xl enhanced-shadow"
              />
              <p className="text-center mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">Sample certificate</p>
            </div>
            
            <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
              <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">Hike</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">The dedication invested in obtaining this increased compensation over time.</p>
              </div>
              
              <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">Advantage</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Acquiring credentials that distinguish you from your peers provides a notable competitive edge in the job market.</p>
              </div>
              
              <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">Productivity</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Entering the workforce with industry-recognized certifications positions you for early success and long-term growth.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embrace Education Strip */}
      <div className="w-full bg-black py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Embrace Education,<br />
              Reach <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">New</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Elevation</span>
            </h2>
            <Link 
              to="/courses"
              className="px-6 sm:px-8 py-3 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm sm:text-base font-medium min-h-[48px]"
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

export default PremiumPassPage;