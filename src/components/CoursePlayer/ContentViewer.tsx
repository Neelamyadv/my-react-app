import React, { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import QuizPlayer from './QuizPlayer';
import { CourseContent, VideoContent, QuizContent, contentService } from '../../lib/contentService';

interface ContentViewerProps {
  content: CourseContent;
  onProgress?: (contentId: string, progress: number) => void;
  onComplete?: (contentId: string) => void;
}

// ========================================
// 🎯 CONTENT VIEWER COMPONENT
// ========================================
// This component handles displaying different types of course content
// (videos, PDFs, quizzes) and manages their interactions

const ContentViewer: React.FC<ContentViewerProps> = ({
  content,
  onProgress,
  onComplete
}) => {
  const [secureUrl, setSecureUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadContent();
  }, [content.id]);

  // ========================================
  // 🔐 CONTENT LOADING & SECURITY
  // ========================================
  // This function loads content and handles secure URL generation
  const loadContent = async () => {
    try {
      setLoading(true);
      setError('');

      // 🔒 SECURE URL GENERATION
      // For production, implement proper signed URL generation:
      // 1. Validate user access permissions
      // 2. Generate time-limited signed URLs
      // 3. Implement domain restrictions
      // 4. Add DRM protection for premium content
      
      if (content.type === 'video' || content.type === 'pdf') {
        // 🚀 PRODUCTION IMPLEMENTATION:
        // const signedUrl = await contentService.getSecureUrl(content.id, userId);
        // setSecureUrl(signedUrl);
        
        // 🧪 DEMO IMPLEMENTATION:
        setSecureUrl(content.url);
      }
    } catch (err) {
      setError('Failed to load content');
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 📊 PROGRESS TRACKING
  // ========================================
  // Handles video progress updates
  const handleVideoProgress = (progress: number) => {
    onProgress?.(content.id, progress);
    
    // 🎯 AUTO-COMPLETION LOGIC
    // You can customize when content is marked as complete:
    // - 90% for videos (current)
    // - 100% for strict completion
    // - Custom thresholds per content type
    if (progress >= 90) {
      onComplete?.(content.id);
    }
  };

  // Handles quiz completion
  const handleQuizComplete = (score: number, passed: boolean) => {
    if (passed) {
      onComplete?.(content.id);
    }
    onProgress?.(content.id, passed ? 100 : score);
  };

  // ========================================
  // 🔄 LOADING STATE
  // ========================================
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // ========================================
  // ❌ ERROR STATE
  // ========================================
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Unavailable</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadContent}
            className="px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ========================================
          📋 CONTENT HEADER
          ======================================== */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h2>
        {content.description && (
          <p className="text-gray-600">{content.description}</p>
        )}
      </div>

      {/* ========================================
          🎥 VIDEO CONTENT
          ======================================== */}
      {/* This renders the video player for video content */}
      {content.type === 'video' && (
        <VideoPlayer
          src={secureUrl} // 📹 VIDEO URL FROM CONTENT SERVICE
          title={content.title}
          onProgress={handleVideoProgress}
          onComplete={() => onComplete?.(content.id)}
          // 🔧 ADDITIONAL VIDEO PROPS YOU CAN ADD:
          // startTime={content.lastWatchedTime} // Resume from last position
          // chapters={content.chapters} // Video chapters for navigation
          // subtitles={content.subtitles} // Subtitle tracks
        />
      )}

      {/* ========================================
          📝 QUIZ CONTENT
          ======================================== */}
      {/* This renders the quiz interface for quiz content */}
      {content.type === 'quiz' && (
        <QuizPlayer
          quiz={content as QuizContent}
          onComplete={handleQuizComplete}
        />
      )}

      {/* ========================================
          📄 PDF CONTENT
          ======================================== */}
      {/* This handles PDF display and download */}
      {content.type === 'pdf' && (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">PDF Resource</h3>
            <p className="text-gray-600 mb-6">
              Download this resource to access the course materials offline.
            </p>
            
            {/* 📄 PDF ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* 👁️ VIEW PDF BUTTON */}
              <a
                href={secureUrl} // 📄 PDF URL FROM CONTENT SERVICE
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
                onClick={() => onComplete?.(content.id)} // Mark as complete when viewed
              >
                <ExternalLink size={20} />
                View PDF
              </a>
              
              {/* 💾 DOWNLOAD PDF BUTTON */}
              <a
                href={secureUrl}
                download // This triggers download instead of opening
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-purple-300 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-colors"
              >
                <Download size={20} />
                Download
              </a>
            </div>
          </div>

          {/* 📖 PDF PREVIEW */}
          {/* Embedded PDF viewer - you can customize this */}
          <div className="mt-8">
            <iframe
              src={`${secureUrl}#toolbar=0`} // Hide PDF toolbar
              className="w-full h-96 border border-gray-200 rounded-xl"
              title={content.title}
              // 🔧 ADDITIONAL IFRAME ATTRIBUTES:
              // sandbox="allow-same-origin allow-scripts" // Security restrictions
              // loading="lazy" // Lazy load for performance
            />
          </div>
        </div>
      )}

      {/* ========================================
          📚 ADDITIONAL CONTENT TYPES
          ======================================== */}
      {/* You can add more content types here */}
      
      {/* 🔗 EXTERNAL RESOURCE TYPE */}
      {content.type === 'resource' && (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExternalLink className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">External Resource</h3>
            <p className="text-gray-600 mb-6">{content.description}</p>
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
              onClick={() => onComplete?.(content.id)}
            >
              <ExternalLink size={20} />
              Open Resource
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentViewer;

// ========================================
// 📋 CONTENT VIEWER CUSTOMIZATION GUIDE
// ========================================
/*
To customize the content viewer for your needs:

1. 🎥 VIDEO CUSTOMIZATION:
   - Add video chapters/bookmarks
   - Implement resume functionality
   - Add subtitle support
   - Create video annotations
   - Add interactive elements

2. 📄 PDF ENHANCEMENTS:
   - Add PDF annotation tools
   - Implement page bookmarking
   - Create searchable PDFs
   - Add print restrictions
   - Enable offline reading

3. 📝 QUIZ IMPROVEMENTS:
   - Add question pools
   - Implement adaptive testing
   - Create timed sections
   - Add multimedia questions
   - Enable collaborative quizzes

4. 🔐 SECURITY FEATURES:
   - Implement DRM protection
   - Add watermarking
   - Create access logs
   - Enable content expiration
   - Add domain restrictions

5. 📊 ANALYTICS TRACKING:
   - Track engagement time
   - Monitor completion rates
   - Analyze learning patterns
   - Create progress reports
   - Implement A/B testing

6. 🎨 UI/UX ENHANCEMENTS:
   - Add dark mode support
   - Create mobile-optimized views
   - Implement keyboard shortcuts
   - Add accessibility features
   - Create custom themes

7. 🔄 CONTENT MANAGEMENT:
   - Add content versioning
   - Implement content scheduling
   - Create content templates
   - Enable bulk operations
   - Add content approval workflows

8. 🌐 INTEGRATION OPTIONS:
   - Connect to LMS systems
   - Add social sharing
   - Implement discussion forums
   - Create study groups
   - Enable peer reviews
*/