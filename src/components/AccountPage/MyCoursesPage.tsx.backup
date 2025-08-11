import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Play, Award, Calendar, TrendingUp } from 'lucide-react';
import { useEnrollment } from '../../hooks/useEnrollment';
import { useAuth } from '../../lib/auth';
import { certificateService } from '../Certificate/CertificateService';
import CertificateModal from '../Certificate/CertificateModal';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const MyCoursesPage = () => {
  const { user } = useAuth();
  const { enrollments, loading, hasPremiumPass } = useEnrollment();
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificates, setCertificates] = useState<any[]>([]);

  // Load certificates when component mounts and when enrollments change
  useEffect(() => {
    if (user) {
      const userCertificates = certificateService.getUserCertificates();
      setCertificates(userCertificates);
      console.log('Loaded certificates on mount:', userCertificates);
    }
  }, [user, enrollments]);

  // Listen for certificate updates
  useEffect(() => {
    const handleCertificateUpdate = (event: any) => {
      console.log('Certificate update event received:', event);
      if (user) {
        const updatedCertificates = certificateService.refreshCertificates();
        setCertificates(updatedCertificates);
        console.log('Updated certificates state:', updatedCertificates);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'zyntiq_certificates') {
        console.log('Storage change detected for certificates');
        handleCertificateUpdate(e);
      }
    };

    // Listen for custom certificate update events
    window.addEventListener('certificateUpdated', handleCertificateUpdate);
    
    // Listen for storage changes (cross-tab updates)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('certificateUpdated', handleCertificateUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCourseImage = (courseId: string) => {
    const images: { [key: string]: string } = {
      'web-development': 'https://cdn3d.iconscout.com/3d/premium/thumb/web-development-5977974-4995252.png',
      'ui-ux-design': 'https://cdn3d.iconscout.com/3d/premium/thumb/ui-ux-design-5977973-4995251.png',
      'digital-marketing': 'https://cdn3d.iconscout.com/3d/premium/thumb/digital-marketing-5706074-4755623.png',
      'javascript': 'https://cdn3d.iconscout.com/3d/premium/thumb/javascript-5977895-4995173.png',
      'angular': 'https://cdn3d.iconscout.com/3d/premium/thumb/angular-5977872-4995150.png',
      'premium-pass': 'https://cdn3d.iconscout.com/3d/premium/thumb/graduation-cap-5856337-4892699.png'
    };
    return images[courseId] || images['web-development'];
  };

  const getCourseDuration = (courseId: string) => {
    const durations: { [key: string]: string } = {
      'web-development': '4+ Hours',
      'ui-ux-design': '3+ Hours',
      'digital-marketing': '2+ Hours',
      'javascript': '4+ Hours',
      'angular': '2+ Hours',
      'premium-pass': 'Unlimited'
    };
    return durations[courseId] || '2+ Hours';
  };

  const getCourseLessons = (courseId: string) => {
    const lessons: { [key: string]: string } = {
      'web-development': '100 lessons',
      'ui-ux-design': '50 lessons',
      'digital-marketing': '60 lessons',
      'javascript': '80 lessons',
      'angular': '40 lessons',
      'premium-pass': 'All courses'
    };
    return lessons[courseId] || '50 lessons';
  };

  const handleCertificateClick = async (course: any) => {
    if (!user) {
      toast.error('Please log in to view your certificate');
      return;
    }

    if (course.progress !== 100) {
      toast.error('Complete the course to unlock your certificate');
      return;
    }

    try {
      console.log('Certificate button clicked for course:', course.course_id);
      
      // Check if certificate already exists for this user and course
      const studentName = `${user.first_name} ${user.last_name}`.trim();
      const existingCertificates = certificateService.getCertificatesByCourse(course.course_id);
      const userCertificate = existingCertificates.find(cert => 
        cert.studentName === studentName
      );
      
      let certificate;

      if (userCertificate) {
        // Use existing certificate
        certificate = userCertificate;
        console.log('Using existing certificate:', certificate);
        toast.success('Certificate loaded successfully!');
      } else {
        // Generate new certificate
        console.log('Generating new certificate for:', studentName, course.course_name, course.course_id);
        certificate = await certificateService.generateCertificate(
          studentName,
          course.course_name,
          course.course_id
        );
        console.log('Generated new certificate:', certificate);
        
        // Update local certificates state immediately
        const updatedCertificates = certificateService.getUserCertificates();
        setCertificates(updatedCertificates);
        console.log('Updated local certificates state:', updatedCertificates);
        
        toast.success('Certificate generated successfully!');
      }

      // Show certificate modal
      setSelectedCertificate(certificate);
      setShowCertificateModal(true);
    } catch (error) {
      console.error('Error handling certificate:', error);
      toast.error('Failed to load certificate. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="glass-card-dark rounded-2xl p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-dark rounded-2xl p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">My Courses</h2>
          <p className="text-gray-600 mt-1">Track your learning progress and continue your journey</p>
        </div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300"
        >
          <BookOpen size={16} />
          Browse Courses
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-purple-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Start Your Learning Journey</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You haven't enrolled in any courses yet. Explore our wide range of courses and start building new skills today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
            >
              <Play size={16} />
              Explore Courses
            </Link>
            <Link
              to="/premium-pass"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-purple-300 text-purple-600 rounded-full font-medium hover:bg-purple-50 transition-colors"
            >
              <Award size={16} />
              Premium Pass
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Learning Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-50/80 to-purple-100/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-8 h-8 text-purple-600" />
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-900">{enrollments.length}</div>
              <div className="text-sm text-purple-700 font-medium">Total Courses</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50/80 to-green-100/80 backdrop-blur-sm rounded-xl p-6 border border-green-200/50">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-green-600" />
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {enrollments.filter(c => c.status === 'completed').length}
              </div>
              <div className="text-sm text-green-700 font-medium">Completed</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50">
              <div className="flex items-center justify-between mb-2">
                <Play className="w-8 h-8 text-blue-600" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {enrollments.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-blue-700 font-medium">In Progress</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/50">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-orange-600" />
                <div className="text-xs text-orange-600 font-semibold">AVG</div>
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {enrollments.length > 0 ? Math.round(enrollments.reduce((acc, course) => acc + course.progress, 0) / enrollments.length) : 0}%
              </div>
              <div className="text-sm text-orange-700 font-medium">Progress</div>
            </div>
          </div>

          {/* Premium Pass Status */}
          {hasPremiumPass && (
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-100/80 to-indigo-100/80 backdrop-blur-sm rounded-2xl border border-purple-200/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-900">Premium Pass Active</h3>
                  <p className="text-purple-700">You have unlimited access to all courses and future content!</p>
                </div>
              </div>
            </div>
          )}

          {/* Courses List */}
          <div className="space-y-6">
            {enrollments.map((course) => (
              <div key={course.id} className="border border-gray-200/50 rounded-2xl p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-300 bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-sm">
                <div className="grid lg:grid-cols-12 gap-6 items-center">
                  {/* Course Image and Basic Info */}
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={getCourseImage(course.course_id)}
                          alt={course.course_name}
                          className="w-20 h-20 object-contain rounded-xl bg-white/80 backdrop-blur-sm p-2 shadow-sm border border-white/30"
                        />
                        {course.status === 'completed' && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Award className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1 truncate">{course.course_name}</h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {course.enrollment_type === 'premium_pass' ? 'Premium Pass Access' : 'Individual Course'}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <BookOpen size={14} />
                            <span>{getCourseLessons(course.course_id)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{getCourseDuration(course.course_id)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="lg:col-span-3">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-bold text-gray-900">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.status)}`}>
                          {course.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dates and Actions */}
                  <div className="lg:col-span-4">
                    <div className="space-y-4">
                      <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>Enrolled: {formatDate(course.enrolled_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">₹{course.amount_paid} paid</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Link
                          to={`/courses/${course.course_id}`}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Play size={14} />
                          {course.status === 'completed' ? 'Review' : 'Continue'}
                        </Link>
                        {course.progress === 100 && (
                          <button 
                            onClick={() => handleCertificateClick(course)}
                            className="px-4 py-2.5 border-2 border-purple-300 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors flex items-center gap-2"
                          >
                            <Award size={14} />
                            Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal
          isOpen={showCertificateModal}
          onClose={() => {
            setShowCertificateModal(false);
            setSelectedCertificate(null);
          }}
          studentName={selectedCertificate.studentName}
          courseName={selectedCertificate.courseName}
          completionDate={selectedCertificate.completionDate}
          certificateId={selectedCertificate.id}
        />
      )}
    </div>
  );
};

export default MyCoursesPage;