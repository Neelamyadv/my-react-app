import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Clock, BookOpen, Award, Download, Users } from 'lucide-react';
import { certificateService } from '../Certificate/CertificateService';
import CertificateModal from '../Certificate/CertificateModal';
import { useAuth } from '../../lib/auth';
import { CourseContent as CourseContentType, contentService } from '../../lib/contentService';
import ContentViewer from '../CoursePlayer/ContentViewer';
import toast from 'react-hot-toast';

interface CourseContentProps {
  courseId: string;
  courseName: string;
  enrollment: any;
  onProgressUpdate: (progress: number) => void;
}

const CourseContent: React.FC<CourseContentProps> = ({ 
  courseId, 
  courseName, 
  enrollment, 
  onProgressUpdate 
}) => {
  const { user } = useAuth();
  const [courseContent, setCourseContent] = useState<CourseContentType[]>([]);
  const [activeContent, setActiveContent] = useState<CourseContentType | null>(null);
  const [completedContent, setCompletedContent] = useState<Set<string>>(new Set());
  const [contentProgress, setContentProgress] = useState<Record<string, number>>({});
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseContent();
  }, [courseId]);

  const loadCourseContent = async () => {
    try {
      setLoading(true);
      const content = await contentService.getCourseContent(courseId);
      setCourseContent(content);
      
      // Set first content as active by default
      if (content.length > 0) {
        setActiveContent(content[0]);
      }
    } catch (error) {
      console.error('Error loading course content:', error);
      toast.error('Failed to load course content');
    } finally {
      setLoading(false);
    }
  };

  const handleContentProgress = (contentId: string, progress: number) => {
    setContentProgress(prev => ({
      ...prev,
      [contentId]: progress
    }));

    // Update overall course progress
    const totalProgress = Object.values({
      ...contentProgress,
      [contentId]: progress
    }).reduce((sum, p) => sum + p, 0) / courseContent.length;
    
    onProgressUpdate(Math.round(totalProgress));
  };

  const handleContentComplete = (contentId: string) => {
    const newCompleted = new Set(completedContent);
    newCompleted.add(contentId);
    setCompletedContent(newCompleted);
    
    // Update progress to 100% for this content
    handleContentProgress(contentId, 100);

    // Check if course is completed (all content completed)
    if (newCompleted.size === courseContent.length) {
      handleCourseCompletion();
    }

    toast.success('Content completed!');
  };

  const handleCourseCompletion = async () => {
    if (!user) return;

    try {
      // Generate certificate
      const certificate = await certificateService.generateCertificate(
        `${user.first_name} ${user.last_name}`.trim(),
        courseName,
        courseId
      );

      toast.success('🎉 Congratulations! You\'ve completed the course and earned your certificate!');
      
      // Show certificate modal after a short delay
      setTimeout(() => {
        setShowCertificateModal(true);
      }, 1000);
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Course completed but there was an issue generating your certificate.');
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'quiz':
        return <BookOpen className="w-4 h-4" />;
      case 'pdf':
        return <Download className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'text-blue-600 bg-blue-50';
      case 'quiz':
        return 'text-green-600 bg-green-50';
      case 'pdf':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Content Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h3>
          
          {/* Progress Overview */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-gray-900">{enrollment?.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${enrollment?.progress || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Content List */}
          <div className="space-y-2">
            {courseContent.map((content, index) => {
              const isCompleted = completedContent.has(content.id);
              const isActive = activeContent?.id === content.id;
              const progress = contentProgress[content.id] || 0;
              
              return (
                <button
                  key={content.id}
                  onClick={() => setActiveContent(content)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-violet-50 border-2 border-violet-200' 
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(content.type)}`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        getContentIcon(content.type)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm mb-1 ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                        {content.title}
                      </h4>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize">{content.type}</span>
                        {content.duration && (
                          <>
                            <span>•</span>
                            <span>{formatDuration(content.duration)}</span>
                          </>
                        )}
                      </div>
                      
                      {/* Progress bar for active/in-progress content */}
                      {progress > 0 && progress < 100 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-violet-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Course Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-violet-600">{completedContent.size}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-600">{courseContent.length}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-2">
        {activeContent ? (
          <ContentViewer
            content={activeContent}
            onProgress={handleContentProgress}
            onComplete={handleContentComplete}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Welcome to the Course</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Select a lesson from the sidebar to start learning. Track your progress as you complete each section.
              </p>
            </div>
          </div>
        )}

        {/* Course Resources */}
        <div className="mt-6 p-6 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl border border-violet-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Resources</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all">
              <Download className="w-5 h-5 text-violet-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Course Materials</div>
                <div className="text-sm text-gray-600">Download PDFs, code files</div>
              </div>
            </button>
            <button 
              onClick={() => setShowCertificateModal(true)}
              className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all"
            >
              <Award className="w-5 h-5 text-violet-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Certificate</div>
                <div className="text-sm text-gray-600">
                  {enrollment?.progress === 100 ? 'Download Certificate' : 'Complete course to unlock'}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {user && (
        <CertificateModal
          isOpen={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
          studentName={`${user.first_name} ${user.last_name}`.trim()}
          courseName={courseName}
          completionDate={new Date().toISOString()}
          certificateId={`CERT-${Date.now().toString(36).toUpperCase()}`}
        />
      )}
    </div>
  );
};

export default CourseContent;