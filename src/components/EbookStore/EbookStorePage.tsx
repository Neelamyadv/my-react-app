import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Download, CheckCircle, Star, Users, Clock } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { usePayment } from '../../hooks/usePayment';
import PaymentModal from '../Payment/PaymentModal';
import { PaymentType } from '../../lib/razorpay';

// eBook data
const ebookData = [
  {
    id: 'web-development',
    title: 'Web Development Complete Guide',
    description: 'Master HTML, CSS, JavaScript, and modern web frameworks. From basics to advanced concepts with practical examples.',
    image: '/WebD.png',
    pages: 150,
    fileSize: '15MB',
    price: 299,
    originalPrice: 599,
    category: 'Programming',
    rating: 4.8,
    students: 1200,
    features: [
      'HTML5 & CSS3 Fundamentals',
      'JavaScript ES6+ Features',
      'React & Angular Frameworks',
      'Responsive Web Design',
      'Backend Integration',
      'Deployment Strategies'
    ]
  },
  {
    id: 'javascript',
    title: 'JavaScript Programming Mastery',
    description: 'Deep dive into JavaScript programming with modern ES6+ features, async programming, and advanced concepts.',
    image: '/JS.png',
    pages: 120,
    fileSize: '12MB',
    price: 299,
    originalPrice: 599,
    category: 'Programming',
    rating: 4.9,
    students: 950,
    features: [
      'ES6+ Modern Features',
      'Async Programming',
      'DOM Manipulation',
      'Object-Oriented JS',
      'Functional Programming',
      'Testing & Debugging'
    ]
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Strategy Guide',
    description: 'Comprehensive digital marketing strategies including SEO, social media, content marketing, and analytics.',
    image: '/DigitalM.png',
    pages: 180,
    fileSize: '18MB',
    price: 299,
    originalPrice: 599,
    category: 'Marketing',
    rating: 4.7,
    students: 800,
    features: [
      'SEO Fundamentals',
      'Social Media Marketing',
      'Content Strategy',
      'Email Marketing',
      'Google Ads & PPC',
      'Analytics & Tracking'
    ]
  },
  {
    id: 'chat-gpt',
    title: 'Chat GPT & AI Applications',
    description: 'Learn to leverage AI tools like ChatGPT for business, content creation, and automation.',
    image: '/AI.png',
    pages: 80,
    fileSize: '8MB',
    price: 299,
    originalPrice: 599,
    category: 'AI & Technology',
    rating: 4.9,
    students: 1500,
    features: [
      'ChatGPT Fundamentals',
      'Prompt Engineering',
      'AI for Business',
      'Content Creation',
      'Automation Tools',
      'Future of AI'
    ]
  },
  {
    id: 'motion-design',
    title: 'Motion Design & Animation',
    description: 'Create stunning animations and motion graphics for web, mobile, and video content.',
    image: '/MotionD.png',
    pages: 100,
    fileSize: '10MB',
    price: 299,
    originalPrice: 599,
    category: 'Design',
    rating: 4.6,
    students: 600,
    features: [
      'Animation Principles',
      'After Effects Basics',
      'Motion Graphics',
      'UI Animation',
      'Video Editing',
      'Export & Optimization'
    ]
  },
  {
    id: 'excel-fundamental',
    title: 'Excel Fundamentals & Advanced',
    description: 'Master Excel from basic functions to advanced formulas, pivot tables, and data analysis.',
    image: '/Excel.png',
    pages: 140,
    fileSize: '14MB',
    price: 299,
    originalPrice: 599,
    category: 'Business',
    rating: 4.8,
    students: 1100,
    features: [
      'Basic Functions',
      'Advanced Formulas',
      'Pivot Tables',
      'Data Analysis',
      'Charts & Graphs',
      'Automation with VBA'
    ]
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Principles',
    description: 'Learn user interface and user experience design principles, tools, and best practices.',
    image: '/UIUX.png',
    pages: 130,
    fileSize: '13MB',
    price: 299,
    originalPrice: 599,
    category: 'Design',
    rating: 4.7,
    students: 750,
    features: [
      'Design Thinking',
      'User Research',
      'Wireframing',
      'Prototyping',
      'Visual Design',
      'Usability Testing'
    ]
  },
  {
    id: 'angular',
    title: 'Angular Framework Deep Dive',
    description: 'Master Angular framework with TypeScript, components, services, and advanced features.',
    image: '/Angular.png',
    pages: 110,
    fileSize: '11MB',
    price: 299,
    originalPrice: 599,
    category: 'Programming',
    rating: 4.8,
    students: 650,
    features: [
      'Angular Fundamentals',
      'TypeScript Integration',
      'Components & Services',
      'Routing & Navigation',
      'State Management',
      'Testing & Deployment'
    ]
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security Essentials',
    description: 'Learn cybersecurity fundamentals, threat detection, and security best practices.',
    image: '/Cyber.png',
    pages: 90,
    fileSize: '9MB',
    price: 299,
    originalPrice: 599,
    category: 'Security',
    rating: 4.9,
    students: 900,
    features: [
      'Security Fundamentals',
      'Threat Detection',
      'Network Security',
      'Cryptography',
      'Incident Response',
      'Security Tools'
    ]
  }
];

// Bundle options
const bundleOptions = [
  {
    id: 'programming-bundle',
    title: 'Programming Bundle',
    description: 'Complete programming guide with Web Development, JavaScript, and Angular',
    ebooks: ['web-development', 'javascript', 'angular'],
    price: 699,
    originalPrice: 897,
    savings: 198,
    badge: 'MOST POPULAR'
  },
  {
    id: 'design-bundle',
    title: 'Design Bundle',
    description: 'Master design with UI/UX and Motion Design eBooks',
    ebooks: ['ui-ux-design', 'motion-design'],
    price: 499,
    originalPrice: 598,
    savings: 99,
    badge: 'BEST VALUE'
  },
  {
    id: 'business-bundle',
    title: 'Business Bundle',
    description: 'Excel and Digital Marketing for business professionals',
    ebooks: ['excel-fundamental', 'digital-marketing'],
    price: 499,
    originalPrice: 598,
    savings: 99,
    badge: 'BUSINESS FOCUS'
  },
  {
    id: 'complete-bundle',
    title: 'Complete Collection',
    description: 'All 9 eBooks at massive discount - Ultimate learning package',
    ebooks: ebookData.map(ebook => ebook.id),
    price: 799,
    originalPrice: 2691,
    savings: 1892,
    badge: 'BEST DEAL'
  }
];

const EbookStorePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { initiateCoursePayment, isPaymentModalOpen, currentPaymentData, closePaymentModal, handlePaymentSuccess } = usePayment();
  
  const [selectedEbooks, setSelectedEbooks] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'individual' | 'bundles'>('individual');

  const handleEbookPurchase = (ebookId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const ebook = ebookData.find(e => e.id === ebookId);
    if (!ebook) return;

    const paymentData = {
      type: PaymentType.EBOOK,
      itemId: ebookId,
      itemName: ebook.title,
      amount: ebook.price,
      userEmail: user.email,
      userName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
      userPhone: user.phone
    };

    initiateCoursePayment(paymentData);
  };

  const handleBundlePurchase = (bundleId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const bundle = bundleOptions.find(b => b.id === bundleId);
    if (!bundle) return;

    const paymentData = {
      type: PaymentType.EBOOK_BUNDLE,
      itemId: bundleId,
      itemName: bundle.title,
      amount: bundle.price,
      userEmail: user.email,
      userName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
      userPhone: user.phone
    };

    initiateCoursePayment(paymentData);
  };

  const handleMultiplePurchase = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (selectedEbooks.length === 0) {
      alert('Please select at least one eBook');
      return;
    }

    const totalPrice = selectedEbooks.length * 299;
    const savings = selectedEbooks.length > 1 ? Math.floor(totalPrice * 0.1) : 0; // 10% discount for multiple
    const finalPrice = totalPrice - savings;

    const paymentData = {
      type: PaymentType.EBOOK_BUNDLE,
      itemId: 'custom-bundle',
      itemName: `Custom eBook Bundle (${selectedEbooks.length} eBooks)`,
      amount: finalPrice,
      userEmail: user.email,
      userName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
      userPhone: user.phone
    };

    initiateCoursePayment(paymentData);
  };

  const toggleEbookSelection = (ebookId: string) => {
    setSelectedEbooks(prev => 
      prev.includes(ebookId) 
        ? prev.filter(id => id !== ebookId)
        : [...prev, ebookId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📚 eBook Store</h1>
              <p className="text-gray-600 mt-1">Comprehensive learning materials for self-paced study</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'individual'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Individual eBooks
            </button>
            <button
              onClick={() => setActiveTab('bundles')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'bundles'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
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
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create Your Own Bundle</h2>
              <p className="text-gray-600 mb-4">
                Select multiple eBooks and get a 10% discount on your custom bundle!
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  Selected: {selectedEbooks.length} eBooks
                </span>
                {selectedEbooks.length > 0 && (
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">
                      ₹{selectedEbooks.length * 299 - Math.floor(selectedEbooks.length * 299 * 0.1)}
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₹{selectedEbooks.length * 299}
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
              {ebookData.map((ebook) => (
                <div key={ebook.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
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
                        checked={selectedEbooks.includes(ebook.id)}
                        onChange={() => toggleEbookSelection(ebook.id)}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
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
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ebook.description}</p>

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

                    <button
                      onClick={() => handleEbookPurchase(ebook.id)}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Buy Now - ₹{ebook.price}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bundles Tab */}
        {activeTab === 'bundles' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {bundleOptions.map((bundle) => (
              <div key={bundle.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{bundle.title}</h3>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                      {bundle.badge}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{bundle.description}</p>

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

                  <button
                    onClick={() => handleBundlePurchase(bundle.id)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors"
                  >
                    Buy Bundle - ₹{bundle.price}
                  </button>
                </div>
              </div>
            ))}
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