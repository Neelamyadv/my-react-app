import React, { useState, useCallback } from 'react';
import { FileText, Download, ExternalLink, Lock, Eye } from 'lucide-react';
import { CourseContent, VideoContent, QuizContent } from '../../lib/contentService';
import QuizPlayer from './QuizPlayer';
import SecureVideoPlayer from './SecureVideoPlayer';
import SecurePDFViewer from './SecurePDFViewer';

interface ContentViewerProps {
  content: CourseContent;
  onComplete?: (contentId: string) => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ content, onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  // Generate secure URL (in production, this would be a signed URL)
  const secureUrl = content.url;

  const handleComplete = useCallback(() => {
    setIsCompleted(true);
    onComplete?.(content.id);
  }, [content.id, onComplete]);

  // Handle different content types
  if (content.type === 'video') {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{content.title}</h3>
          <p className="text-gray-600">{content.description}</p>
        </div>

        {/* 🔒 Secure Video Player */}
        <SecureVideoPlayer
          src={secureUrl}
          title={content.title}
          onProgress={(progress) => {
            // Track progress for completion
            if (progress >= 90 && !isCompleted) {
              handleComplete();
            }
          }}
          onComplete={handleComplete}
        />

        {/* 📝 Video Information */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Content Protection Active</span>
          </div>
          <p className="text-sm text-blue-700">
            This video is protected against downloading, screen recording, and unauthorized sharing. 
            Please respect our intellectual property rights.
          </p>
        </div>
      </div>
    );
  }

  if (content.type === 'pdf') {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{content.title}</h3>
          <p className="text-gray-600">{content.description}</p>
        </div>

        {/* 🔒 Secure PDF Viewer */}
        <SecurePDFViewer
          src={secureUrl}
          title={content.title}
          onComplete={handleComplete}
        />

        {/* 📊 PDF Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Protected PDF</p>
            <p className="font-semibold text-gray-900">No Download</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <Eye className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">View Only</p>
            <p className="font-semibold text-gray-900">No Copying</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <Lock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Secure Access</p>
            <p className="font-semibold text-gray-900">Protected</p>
          </div>
        </div>
      </div>
    );
  }

  if (content.type === 'quiz') {
    return (
      <QuizPlayer
        quiz={content as QuizContent}
        onComplete={handleComplete}
      />
    );
  }

  // External resource type (for non-protected content)
  if (content.type === 'resource') {
    return (
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
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="text-center">
        <p className="text-gray-600">Unsupported content type</p>
      </div>
    </div>
  );
};

export default ContentViewer;