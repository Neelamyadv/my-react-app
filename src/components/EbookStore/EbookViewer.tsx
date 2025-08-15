import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Download, Eye, Lock } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useEnrollment } from '../../hooks/useEnrollment';
import toast from 'react-hot-toast';

// Mock eBook data
const ebookData = [
  {
    id: 'web-development-ebook',
    title: 'Web Development Fundamentals',
    description: 'Complete guide to HTML, CSS, JavaScript, and modern web development practices.',
    category: 'Programming',
    pages: 245,
    fileSize: '15.2 MB',
    pdfUrl: '/ebooks/web-development-fundamentals.pdf',
    coverImage: '/images/courses/web-development.jpg'
  },
  {
    id: 'python-ebook',
    title: 'Python Programming Mastery',
    description: 'Learn Python from basics to advanced concepts including data science and automation.',
    category: 'Programming',
    pages: 312,
    fileSize: '18.7 MB',
    pdfUrl: '/ebooks/python-programming-mastery.pdf',
    coverImage: '/images/courses/python.jpg'
  },
  {
    id: 'java-ebook',
    title: 'Java Development Complete',
    description: 'Master Java programming, OOP concepts, and enterprise development.',
    category: 'Programming',
    pages: 289,
    fileSize: '16.9 MB',
    pdfUrl: '/ebooks/java-development-complete.pdf',
    coverImage: '/images/courses/java.jpg'
  },
  {
    id: 'ui-ux-ebook',
    title: 'UI/UX Design Principles',
    description: 'Learn user interface and user experience design from concept to implementation.',
    category: 'Design',
    pages: 198,
    fileSize: '12.4 MB',
    pdfUrl: '/ebooks/ui-ux-design-principles.pdf',
    coverImage: '/images/courses/ui-ux.jpg'
  },
  {
    id: 'graphic-design-ebook',
    title: 'Graphic Design Mastery',
    description: 'Master graphic design tools, principles, and creative techniques.',
    category: 'Design',
    pages: 223,
    fileSize: '14.1 MB',
    pdfUrl: '/ebooks/graphic-design-mastery.pdf',
    coverImage: '/images/courses/graphic-design.jpg'
  },
  {
    id: 'digital-marketing-ebook',
    title: 'Digital Marketing Strategy',
    description: 'Comprehensive guide to digital marketing, SEO, and social media strategies.',
    category: 'Business',
    pages: 267,
    fileSize: '17.3 MB',
    pdfUrl: '/ebooks/digital-marketing-strategy.pdf',
    coverImage: '/images/courses/digital-marketing.jpg'
  },
  {
    id: 'business-analytics-ebook',
    title: 'Business Analytics & Insights',
    description: 'Learn data analysis, business intelligence, and decision-making strategies.',
    category: 'Business',
    pages: 234,
    fileSize: '13.8 MB',
    pdfUrl: '/ebooks/business-analytics-insights.pdf',
    coverImage: '/images/courses/business-analytics.jpg'
  },
  {
    id: 'mobile-development-ebook',
    title: 'Mobile App Development',
    description: 'Build iOS and Android apps using React Native and modern mobile technologies.',
    category: 'Programming',
    pages: 301,
    fileSize: '19.2 MB',
    pdfUrl: '/ebooks/mobile-app-development.pdf',
    coverImage: '/images/courses/mobile-development.jpg'
  },
  {
    id: 'cybersecurity-ebook',
    title: 'Cybersecurity Fundamentals',
    description: 'Learn security principles, ethical hacking, and protection strategies.',
    category: 'Programming',
    pages: 278,
    fileSize: '16.5 MB',
    pdfUrl: '/ebooks/cybersecurity-fundamentals.pdf',
    coverImage: '/images/courses/cybersecurity.jpg'
  }
];

const EbookViewer = () => {
  const { ebookId } = useParams<{ ebookId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPremiumPass, enrolledCourses } = useEnrollment();
  const [isLoading, setIsLoading] = useState(false);

  const ebook = ebookData.find(e => e.id === ebookId);

  // Check if user has access to this eBook
  const hasAccess = () => {
    if (!user) return false;
    if (hasPremiumPass) return true;
    
    // Check if user has enrolled in the corresponding course
    const courseId = ebookId?.replace('-ebook', '');
    const hasCourseEnrollment = enrolledCourses.some(course => course.id === courseId);
    if (hasCourseEnrollment) return true;
    
    // Check if user has manual access granted (this would be from the backend in real app)
    // For now, we'll simulate this with localStorage
    if (ebookId) {
      const manualAccess = localStorage.getItem(`ebook_access_${user.email}_${ebookId}`);
      return manualAccess === 'true';
    }
    
    return false;
  };

  if (!ebook) {
    return (
      <div className="min-h-screen yellow-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">eBook Not Found</h1>
          <p className="text-gray-600 mb-6">The eBook you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/ebooks')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to eBook Store
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen yellow-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
          <p className="text-gray-600 mb-6">Please login to access this eBook.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess()) {
    return (
      <div className="min-h-screen yellow-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to purchase this eBook to access it.</p>
          <button
            onClick={() => navigate('/ebooks')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to eBook Store
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    toast.error('Download is disabled for content protection. Please read online.');
  };

  return (
    <div className="min-h-screen yellow-gradient-bg">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/ebooks')}
                className="text-gray-700 hover:text-gray-900 transition-colors bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white/70"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{ebook.title}</h1>
                <p className="text-gray-600 text-sm">Secure eBook Viewer</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Eye className="w-4 h-4" />
                Access Granted
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* eBook Info */}
        <div className="glass-card-dark rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img
                src={ebook.coverImage}
                alt={ebook.title}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{ebook.title}</h2>
              <p className="text-gray-700 mb-4">{ebook.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">{ebook.pages} pages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">{ebook.fileSize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {ebook.category}
                  </span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">📖 Reading Instructions</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• This eBook is protected and cannot be downloaded</li>
                  <li>• Use the secure viewer below to read the content</li>
                  <li>• Screenshots and copying are disabled for content protection</li>
                  <li>• Your progress will be automatically saved</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Secure PDF Viewer */}
        <div className="glass-card-dark rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Secure eBook Viewer</h3>
            <div className="flex items-center gap-2">
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Protected
              </span>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure PDF Viewer</h4>
            <p className="text-gray-600 mb-4">
              This is where the secure PDF viewer would be embedded. 
              The actual PDF content would be displayed here with protection features enabled.
            </p>
            <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
              <p className="text-sm text-gray-500">
                📄 PDF Content: {ebook.title}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                (Protected viewer with no download, screenshot, or copy functionality)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookViewer;