import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Download, CheckCircle, Star, Users, Clock, Lock, Eye } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useEnrollment } from '../../hooks/useEnrollment';
import { usePayment } from '../../hooks/usePayment';
import PaymentModal from '../Payment/PaymentModal';
import { PaymentType } from '../../lib/razorpay';
import toast from 'react-hot-toast';

// eBook data (all 9 courses)
const ebookData = [
  {
    id: 'web-development-ebook',
    title: 'Web Development Fundamentals',
    description: 'Complete guide to HTML, CSS, JavaScript, and modern web development practices.',
    category: 'Programming',
    price: 345,
    originalPrice: 599,
    pages: 245,
    fileSize: '15.2 MB',
    students: 1250,
    rating: 4.8,
    image: '/images/courses/web-development.jpg',
    courseId: 'web-development'
  },
  {
    id: 'python-ebook',
    title: 'Python Programming Mastery',
    description: 'Learn Python from basics to advanced concepts including data science and automation.',
    category: 'Programming',
    price: 345,
    originalPrice: 599,
    pages: 312,
    fileSize: '18.7 MB',
    students: 980,
    rating: 4.9,
    image: '/images/courses/python.jpg',
    courseId: 'python'
  },
  {
    id: 'java-ebook',
    title: 'Java Development Complete',
    description: 'Master Java programming, OOP concepts, and enterprise development.',
    category: 'Programming',
    price: 345,
    originalPrice: 599,
    pages: 289,
    fileSize: '16.9 MB',
    students: 756,
    rating: 4.7,
    image: '/images/courses/java.jpg',
    courseId: 'java'
  },
  {
    id: 'ui-ux-ebook',
    title: 'UI/UX Design Principles',
    description: 'Learn user interface and user experience design from concept to implementation.',
    category: 'Design',
    price: 345,
    originalPrice: 599,
    pages: 198,
    fileSize: '12.4 MB',
    students: 892,
    rating: 4.6,
    image: '/images/courses/ui-ux.jpg',
    courseId: 'ui-ux'
  },
  {
    id: 'graphic-design-ebook',
    title: 'Graphic Design Mastery',
    description: 'Master graphic design tools, principles, and creative techniques.',
    category: 'Design',
    price: 345,
    originalPrice: 599,
    pages: 223,
    fileSize: '14.1 MB',
    students: 654,
    rating: 4.5,
    image: '/images/courses/graphic-design.jpg',
    courseId: 'graphic-design'
  },
  {
    id: 'digital-marketing-ebook',
    title: 'Digital Marketing Strategy',
    description: 'Comprehensive guide to digital marketing, SEO, and social media strategies.',
    category: 'Business',
    price: 345,
    originalPrice: 599,
    pages: 267,
    fileSize: '17.3 MB',
    students: 1123,
    rating: 4.8,
    image: '/images/courses/digital-marketing.jpg',
    courseId: 'digital-marketing'
  },
  {
    id: 'business-analytics-ebook',
    title: 'Business Analytics & Insights',
    description: 'Learn data analysis, business intelligence, and decision-making strategies.',
    category: 'Business',
    price: 345,
    originalPrice: 599,
    pages: 234,
    fileSize: '13.8 MB',
    students: 445,
    rating: 4.7,
    image: '/images/courses/business-analytics.jpg',
    courseId: 'business-analytics'
  },
  {
    id: 'mobile-development-ebook',
    title: 'Mobile App Development',
    description: 'Build iOS and Android apps using React Native and modern mobile technologies.',
    category: 'Programming',
    price: 345,
    originalPrice: 599,
    pages: 301,
    fileSize: '19.2 MB',
    students: 678,
    rating: 4.6,
    image: '/images/courses/mobile-development.jpg',
    courseId: 'mobile-development'
  },
  {
    id: 'cybersecurity-ebook',
    title: 'Cybersecurity Fundamentals',
    description: 'Learn security principles, ethical hacking, and protection strategies.',
    category: 'Programming',
    price: 345,
    originalPrice: 599,
    pages: 278,
    fileSize: '16.5 MB',
    students: 389,
    rating: 4.9,
    image: '/images/courses/cybersecurity.jpg',
    courseId: 'cybersecurity'
  }
];

// Bundle options
const bundleOptions = [
  {
    id: 'programming-bundle',
    title: 'Programming Bundle',
    description: 'Complete programming collection: Web, Python, Java, Mobile, and Cybersecurity.',
    badge: '5 eBooks',
    price: 1399,
    originalPrice: 1725,
    savings: 326,
    ebooks: ['web-development-ebook', 'python-ebook', 'java-ebook', 'mobile-development-ebook', 'cybersecurity-ebook']
  },
  {
    id: 'design-bundle',
    title: 'Design Bundle',
    description: 'Creative design collection: UI/UX and Graphic Design fundamentals.',
    badge: '2 eBooks',
    price: 599,
    originalPrice: 690,
    savings: 91,
    ebooks: ['ui-ux-ebook', 'graphic-design-ebook']
  },
  {
    id: 'business-bundle',
    title: 'Business Bundle',
    description: 'Business essentials: Digital Marketing and Business Analytics.',
    badge: '2 eBooks',
    price: 599,
    originalPrice: 690,
    savings: 91,
    ebooks: ['digital-marketing-ebook', 'business-analytics-ebook']
  },
  {
    id: 'complete-collection',
    title: 'Complete Collection',
    description: 'All 9 eBooks in one comprehensive bundle. Best value!',
    badge: '9 eBooks',
    price: 1999,
    originalPrice: 3105,
    savings: 1106,
    ebooks: ['web-development-ebook', 'python-ebook', 'java-ebook', 'ui-ux-ebook', 'graphic-design-ebook', 'digital-marketing-ebook', 'business-analytics-ebook', 'mobile-development-ebook', 'cybersecurity-ebook']
  }
];

const EbookStorePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPremiumPass, enrolledCourses } = useEnrollment();
  const { initiateCoursePayment, isPaymentModalOpen, currentPaymentData, closePaymentModal, handlePaymentSuccess } = usePayment();
  
  const [selectedEbooks, setSelectedEbooks] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'individual' | 'bundles'>('individual');

  // Check if user has access to specific eBook
  const hasEbookAccess = (ebookId: string) => {
    if (!user) return false;
    
    // Check if user has premium pass (access to all)
    if (hasPremiumPass) return true;
    
    // Check if user has purchased this specific eBook
    const ebook = ebookData.find(e => e.id === ebookId);
    if (ebook) {
      // Check if user has enrolled in the corresponding course
      const hasCourseEnrollment = enrolledCourses.some(course => course.id === ebook.courseId);
      if (hasCourseEnrollment) return true;
    }
    
    // Check if user has manual access granted (this would be from the backend in real app)
    // For now, we'll simulate this with localStorage
    const manualAccess = localStorage.getItem(`ebook_access_${user.email}_${ebookId}`);
    return manualAccess === 'true';
  };

  // Check if user has access to bundle
  const hasBundleAccess = (bundleId: string) => {
    if (!user) return false;
    if (hasPremiumPass) return true;
    
    const bundle = bundleOptions.find(b => b.id === bundleId);
    if (bundle) {
      // Check if user has access to all eBooks in the bundle
      return bundle.ebooks.every(ebookId => hasEbookAccess(ebookId));
    }
    
    return false;
  };

  // Check if user has access to all eBooks bundle
  const hasAllEbooksAccess = () => {
    if (!user) return false;
    if (hasPremiumPass) return true;
    
    // Check if user has purchased the all-ebooks bundle
    return enrolledCourses.some(course => course.id === 'all-ebooks-bundle');
  };

  const handleEbookPurchase = (ebookId: string) => {
    if (!user) {
      toast.error('Please login to purchase eBooks');
      navigate('/login');
      return;
    }

    const ebook = ebookData.find(e => e.id === ebookId);
    if (!ebook) return;

    initiateCoursePayment({
      courseId: ebookId,
      courseName: ebook.title,
      price: ebook.price,
      originalPrice: ebook.originalPrice,
      type: PaymentType.EBOOK
    });
  };

  const handleBundlePurchase = (bundleId: string) => {
    if (!user) {
      toast.error('Please login to purchase bundles');
      navigate('/login');
      return;
    }

    const bundle = bundleOptions.find(b => b.id === bundleId);
    if (!bundle) return;

    initiateCoursePayment({
      courseId: bundleId,
      courseName: bundle.title,
      price: bundle.price,
      originalPrice: bundle.originalPrice,
      type: PaymentType.EBOOK_BUNDLE
    });
  };

  const handleAllEbooksPurchase = () => {
    if (!user) {
      toast.error('Please login to purchase the All eBooks Bundle');
      navigate('/login');
      return;
    }

    initiateCoursePayment({
      courseId: 'all-ebooks-bundle',
      courseName: 'Complete All eBooks Collection',
      price: 495,
      originalPrice: 3105,
      type: PaymentType.EBOOK_BUNDLE
    });
  };

  const handleMultiplePurchase = () => {
    if (!user) {
      toast.error('Please login to purchase eBooks');
      navigate('/login');
      return;
    }

    const totalPrice = selectedEbooks.length * 345 - Math.floor(selectedEbooks.length * 345 * 0.1);
    const originalPrice = selectedEbooks.length * 345;

    initiateCoursePayment({
      courseId: 'custom-ebook-bundle',
      courseName: `Custom eBook Bundle (${selectedEbooks.length} eBooks)`,
      price: totalPrice,
      originalPrice: originalPrice,
      type: PaymentType.EBOOK_BUNDLE
    });
  };

  const toggleEbookSelection = (ebookId: string) => {
    setSelectedEbooks(prev => 
      prev.includes(ebookId) 
        ? prev.filter(id => id !== ebookId)
        : [...prev, ebookId]
    );
  };

  const handleEbookAccess = (ebookId: string) => {
    if (!user) {
      toast.error('Please login to access eBooks');
      navigate('/login');
      return;
    }

    if (hasEbookAccess(ebookId)) {
      // Navigate to eBook viewer
      navigate(`/ebook-viewer/${ebookId}`);
    } else {
      toast.error('Please purchase this eBook to access it');
    }
  };

  const handleBundleAccess = (bundleId: string) => {
    if (!user) {
      toast.error('Please login to access bundles');
      navigate('/login');
      return;
    }

    if (hasBundleAccess(bundleId)) {
      // Navigate to bundle viewer
      navigate(`/ebook-bundle/${bundleId}`);
    } else {
      toast.error('Please purchase this bundle to access it');
    }
  };

  const handleAllEbooksAccess = () => {
    if (!user) {
      toast.error('Please login to access the All eBooks Bundle');
      navigate('/login');
      return;
    }

    if (hasAllEbooksAccess()) {
      // Navigate to all eBooks viewer
      navigate('/all-ebooks-viewer');
    } else {
      toast.error('Please purchase the All eBooks Bundle to access it');
    }
  };

  return (
    <div className="min-h-screen yellow-gradient-bg relative overflow-hidden">
      {/* 🎨 Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large organic shapes */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-400/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-yellow-500/25 rounded-full blur-2xl"></div>
        
        {/* Smaller decorative shapes */}
        <div className="absolute top-20 left-1/4 w-16 h-16 bg-yellow-300/30 rounded-2xl transform rotate-45 blur-xl"></div>
        <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-orange-300/40 rounded-full blur-lg"></div>
        <div className="absolute top-1/3 left-1/6 w-8 h-8 bg-yellow-200/50 rounded-lg blur-md"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📚 eBook Store</h1>
              <p className="text-gray-700 mt-1">Comprehensive learning materials for self-paced study</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-gray-900 transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/70"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 🎯 All eBooks Bundle Section */}
        <div className="mb-12">
          <div className="glass-card-dark rounded-3xl shadow-lg p-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-xl"></div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <span className="text-lg">🎯</span>
                  <span>SPECIAL OFFER</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete All eBooks Collection</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get access to all 9 comprehensive eBooks at an incredible price! 
                  Perfect for learners who want to master multiple skills.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Left: eBook Covers Grid */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Get:</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {ebookData.map((ebook, index) => (
                      <div key={ebook.id} className="relative group">
                        <img
                          src={ebook.image}
                          alt={ebook.title}
                          className="w-full h-20 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white text-xs font-medium text-center px-1">
                            {ebook.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Pricing and CTA */}
                <div className="text-center lg:text-left">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                                         <div className="mb-4">
                       <span className="text-4xl font-bold text-gray-900">₹495</span>
                       <span className="text-xl text-gray-500 line-through ml-2">₹3105</span>
                     </div>
                     <div className="text-green-600 font-semibold mb-4">
                       Save ₹2610 (84% OFF!)
                     </div>
                    
                    <div className="space-y-2 mb-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>All 9 eBooks included</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Lifetime access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Instant download access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Best value for money</span>
                      </div>
                    </div>

                    {hasAllEbooksAccess() ? (
                      <button
                        onClick={handleAllEbooksAccess}
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-5 h-5" />
                        Access All eBooks
                      </button>
                    ) : (
                      <button
                        onClick={handleAllEbooksPurchase}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="text-xl">🎯</span>
                        Buy All eBooks - ₹495
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="glass-card-dark rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'individual'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Individual eBooks
            </button>
            <button
              onClick={() => setActiveTab('bundles')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'bundles'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Bundles & Collections
            </button>
          </div>
        </div>

        {/* Individual eBooks Tab */}
        {activeTab === 'individual' && (
          <div>
            {/* Multiple Selection Section */}
            <div className="glass-card-dark rounded-2xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create Your Own Bundle</h2>
              <p className="text-gray-700 mb-4">
                Select multiple eBooks and get a 10% discount on your custom bundle!
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  Selected: {selectedEbooks.length} eBooks
                </span>
                {selectedEbooks.length > 0 && (
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">
                      ₹{selectedEbooks.length * 345 - Math.floor(selectedEbooks.length * 345 * 0.1)}
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₹{selectedEbooks.length * 345}
                    </span>
                  </div>
                )}
              </div>

              {selectedEbooks.length > 0 && (
                <button
                  onClick={handleMultiplePurchase}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Buy Selected eBooks ({selectedEbooks.length})
                </button>
              )}
            </div>

            {/* eBook Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ebookData.map((ebook) => {
                const hasAccess = hasEbookAccess(ebook.id);
                const isSelected = selectedEbooks.includes(ebook.id);
                
                return (
                  <div key={ebook.id} className="glass-card-dark rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* eBook Image */}
                    <div className="relative">
                      <img
                        src={ebook.image}
                        alt={ebook.title}
                        className="w-full h-48 object-cover rounded-t-2xl"
                      />
                      <div className="absolute top-4 right-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleEbookSelection(ebook.id)}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                      {/* Access Status Badge */}
                      <div className="absolute top-4 left-4">
                        {hasAccess ? (
                          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Access
                          </div>
                        ) : (
                          <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Locked
                          </div>
                        )}
                      </div>
                    </div>

                    {/* eBook Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {ebook.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{ebook.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">{ebook.title}</h3>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{ebook.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {ebook.pages} pages
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {ebook.fileSize}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {ebook.students}+ students
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">₹{ebook.price}</span>
                          <span className="text-sm text-gray-500 line-through ml-2">₹{ebook.originalPrice}</span>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          50% OFF
                        </span>
                      </div>

                      {/* Action Buttons */}
                      {hasAccess ? (
                        <button
                          onClick={() => handleEbookAccess(ebook.id)}
                          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Read eBook
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEbookPurchase(ebook.id)}
                          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Buy Now - ₹{ebook.price}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bundles Tab */}
        {activeTab === 'bundles' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {bundleOptions.map((bundle) => {
              const hasAccess = hasBundleAccess(bundle.id);
              
              return (
                <div key={bundle.id} className="glass-card-dark rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{bundle.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                          {bundle.badge}
                        </span>
                        {hasAccess ? (
                          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Access
                          </div>
                        ) : (
                          <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Locked
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{bundle.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {bundle.ebooks.map((ebookId) => {
                        const ebook = ebookData.find(e => e.id === ebookId);
                        return ebook ? (
                          <div key={ebookId} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <img src={ebook.image} alt={ebook.title} className="w-8 h-8 object-cover rounded" />
                            <span className="text-sm font-medium text-gray-700">{ebook.title}</span>
                          </div>
                        ) : null;
                      })}
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-3xl font-bold text-gray-900">₹{bundle.price}</span>
                        <span className="text-lg text-gray-500 line-through ml-2">₹{bundle.originalPrice}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-green-600 font-medium">Save ₹{bundle.savings}</span>
                        <div className="text-xs text-gray-500">
                          {Math.round((bundle.savings / bundle.originalPrice) * 100)}% OFF
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {hasAccess ? (
                      <button
                        onClick={() => handleBundleAccess(bundle.id)}
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Access Bundle
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBundlePurchase(bundle.id)}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors"
                      >
                        Buy Bundle - ₹{bundle.price}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && currentPaymentData && (
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

export default EbookStorePage;