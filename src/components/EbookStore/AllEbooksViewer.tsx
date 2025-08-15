import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Eye, Lock, Search, Filter } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useEnrollment } from '../../hooks/useEnrollment';
import toast from 'react-hot-toast';

// eBook data (same as in EbookStorePage)
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
    pages: 278,
    fileSize: '16.5 MB',
    students: 389,
    rating: 4.9,
    image: '/images/courses/cybersecurity.jpg',
    courseId: 'cybersecurity'
  }
];

const AllEbooksViewer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPremiumPass, enrolledCourses } = useEnrollment();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Check if user has access to all eBooks bundle
  const hasAllEbooksAccess = () => {
    if (!user) return false;
    if (hasPremiumPass) return true;
    
    // Check if user has purchased the all-ebooks bundle
    const hasBundleEnrollment = enrolledCourses.some(course => course.id === 'all-ebooks-bundle');
    if (hasBundleEnrollment) return true;
    
    // Check if user has manual access to all eBooks (this would be from the backend in real app)
    // For now, we'll simulate this with localStorage
    const allEbookIds = ebookData.map(ebook => ebook.id);
    const hasManualAccess = allEbookIds.every(ebookId => 
      localStorage.getItem(`ebook_access_${user.email}_${ebookId}`) === 'true'
    );
    return hasManualAccess;
  };

  // Filter eBooks based on search and category
  const filteredEbooks = ebookData.filter(ebook => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ebook.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || ebook.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(ebookData.map(ebook => ebook.category)))];

  if (!user) {
    return (
      <div className="min-h-screen yellow-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
          <p className="text-gray-600 mb-6">Please login to access your eBooks.</p>
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

  if (!hasAllEbooksAccess()) {
    return (
      <div className="min-h-screen yellow-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to purchase the All eBooks Bundle to access this content.</p>
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

  const handleEbookClick = (ebookId: string) => {
    navigate(`/ebook-viewer/${ebookId}`);
  };

  return (
    <div className="min-h-screen yellow-gradient-bg">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/ebooks')}
                className="text-gray-700 hover:text-gray-900 transition-colors bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white/70"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">📚 All eBooks Collection</h1>
                <p className="text-gray-600 text-sm">Your complete library of learning materials</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Eye className="w-4 h-4" />
                Full Access
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Card */}
        <div className="glass-card-dark rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{ebookData.length}</div>
              <div className="text-sm text-gray-600">Total eBooks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{ebookData.filter(e => e.category === 'Programming').length}</div>
              <div className="text-sm text-gray-600">Programming</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{ebookData.filter(e => e.category === 'Design').length}</div>
              <div className="text-sm text-gray-600">Design</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{ebookData.filter(e => e.category === 'Business').length}</div>
              <div className="text-sm text-gray-600">Business</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="glass-card-dark rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search eBooks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* eBooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEbooks.map((ebook) => (
            <div 
              key={ebook.id} 
              className="glass-card-dark rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleEbookClick(ebook.id)}
            >
              {/* eBook Image */}
              <div className="relative">
                <img
                  src={ebook.image}
                  alt={ebook.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Access
                  </div>
                </div>
              </div>

              {/* eBook Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {ebook.category}
                  </span>
                  <div className="flex items-center gap-1">
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
                    <span>{ebook.fileSize}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>{ebook.students}+ students</span>
                  </span>
                </div>

                <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Read eBook
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEbooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No eBooks Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEbooksViewer;