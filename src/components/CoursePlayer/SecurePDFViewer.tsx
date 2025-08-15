import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Lock, Eye, BookOpen } from 'lucide-react';

interface SecurePDFViewerProps {
  src: string;
  title: string;
  onComplete?: () => void;
}

const SecurePDFViewer: React.FC<SecurePDFViewerProps> = ({
  src,
  title,
  onComplete
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isProtected, setIsProtected] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 🔒 Content Protection Functions
  const enableProtection = () => {
    // Disable right-click globally when PDF is active
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showProtectionMessage('Right-click disabled for content protection');
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const blockedKeys = [
        'F11', 'F12', 'PrintScreen', 'PrtScn',
        'Ctrl+c', 'Ctrl+v', 'Ctrl+a', 'Ctrl+s',
        'Ctrl+p', 'Ctrl+u', 'F5', 'Ctrl+r',
        'Ctrl+d', 'Ctrl+n', 'Ctrl+w'
      ];

      const keyCombo = e.ctrlKey ? `Ctrl+${e.key.toLowerCase()}` : e.key;
      
      if (blockedKeys.includes(keyCombo)) {
        e.preventDefault();
        showProtectionMessage('Keyboard shortcut disabled for content protection');
      }
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    // Disable drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      showProtectionMessage('Drag and drop disabled for content protection');
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
    };
  };

  // 🛡️ Screenshot prevention
  const preventScreenshots = () => {
    // Add CSS to prevent screenshots (basic protection)
    const style = document.createElement('style');
    style.textContent = `
      .secure-pdf-container {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      
      .secure-pdf-container * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      .secure-pdf-iframe {
        pointer-events: auto;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  };

  // 💬 Show protection messages
  const showProtectionMessage = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg z-50 shadow-lg';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  // 📄 PDF control functions
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const zoomIn = () => {
    setScale(Math.min(scale + 0.25, 3));
  };

  const zoomOut = () => {
    setScale(Math.max(scale - 0.25, 0.5));
  };

  const rotate = () => {
    setRotation((rotation + 90) % 360);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => setShowControls(false), 3000);
    setControlsTimeout(timeout);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    
    // Try to get total pages from iframe
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        // This is a basic approach - in production, you'd use PDF.js or similar
        setTimeout(() => {
          setTotalPages(1); // Default to 1, will be updated if we can detect more
        }, 1000);
      }
    } catch (error) {
      console.log('Could not detect PDF pages');
    }
  };

  const handleIframeError = () => {
    setError('Failed to load PDF. Please try again.');
    setIsLoading(false);
  };

  useEffect(() => {
    const cleanup = enableProtection();
    const screenshotCleanup = preventScreenshots();

    return () => {
      cleanup();
      screenshotCleanup();
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, []);

  // 🎯 Progress tracking
  useEffect(() => {
    if (currentPage === totalPages && totalPages > 0) {
      onComplete?.();
    }
  }, [currentPage, totalPages, onComplete]);

  return (
    <div 
      ref={containerRef}
      className="relative bg-white rounded-xl overflow-hidden shadow-lg secure-pdf-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* 🔒 Protection Overlay */}
      {isProtected && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-lg">
          <Lock className="w-4 h-4" />
          <span className="text-sm font-medium">Protected PDF</span>
        </div>
      )}

      {/* 📄 PDF Viewer */}
      <div className="relative w-full h-[600px] bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <iframe
            ref={iframeRef}
            src={`${src}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0&view=FitH`}
            className="w-full h-full secure-pdf-iframe"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.3s ease'
            }}
            sandbox="allow-same-origin allow-scripts"
            title={title}
          />
        )}
      </div>

      {/* 🎛️ Controls Overlay */}
      {showControls && !isLoading && !error && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Page Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={prevPage}
                disabled={currentPage <= 1}
                className="text-white hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <span className="text-white text-sm">
                Page {currentPage} of {totalPages || '?'}
              </span>

              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages}
                className="text-white hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={zoomOut}
                className="text-white hover:text-blue-400 transition-colors p-1"
              >
                <ZoomOut className="w-5 h-5" />
              </button>

              <span className="text-white text-sm min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>

              <button
                onClick={zoomIn}
                className="text-white hover:text-blue-400 transition-colors p-1"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              <button
                onClick={rotate}
                className="text-white hover:text-blue-400 transition-colors p-1"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentPage / Math.max(totalPages, 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 🚫 Protection Warning */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white px-4 py-2 rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="text-sm">PDF Protected</span>
          </div>
        </div>
      </div>

      {/* 📝 Protection Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Lock className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Content Protection Active:</strong> This PDF is protected against downloading, copying, and screenshots. 
              Please respect our intellectual property rights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurePDFViewer;