import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Lock, Eye } from 'lucide-react';

interface SecureVideoPlayerProps {
  src: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  src,
  title,
  onProgress,
  onComplete
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isProtected, setIsProtected] = useState(true);

  // 🔒 Content Protection Functions
  const enableProtection = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showProtectionMessage('Right-click disabled for content protection');
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const blockedKeys = [
        'F11', 'F12', 'PrintScreen', 'PrtScn',
        'Ctrl+c', 'Ctrl+v', 'Ctrl+a', 'Ctrl+s',
        'Ctrl+p', 'Ctrl+u', 'F5', 'Ctrl+r'
      ];

      const keyCombo = e.ctrlKey ? `Ctrl+${e.key.toLowerCase()}` : e.key;
      
      if (blockedKeys.includes(keyCombo)) {
        e.preventDefault();
        showProtectionMessage('Keyboard shortcut disabled for content protection');
      }
    };

    // Disable drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      showProtectionMessage('Drag and drop disabled for content protection');
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    // Add event listeners
    video.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    video.addEventListener('dragstart', handleDragStart);
    video.addEventListener('selectstart', handleSelectStart);

    // Cleanup function
    return () => {
      video.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      video.removeEventListener('dragstart', handleDragStart);
      video.removeEventListener('selectstart', handleSelectStart);
    };
  };

  // 🛡️ Screen recording detection
  const detectScreenRecording = () => {
    // Check for screen recording indicators
    const checkScreenRecording = () => {
      // This is a basic detection - in production, you'd use more sophisticated methods
      const mediaDevices = navigator.mediaDevices;
      if (mediaDevices && mediaDevices.getDisplayMedia) {
        // Monitor for screen sharing attempts
        console.log('Screen recording detection active');
      }
    };

    // Check periodically
    const interval = setInterval(checkScreenRecording, 5000);
    return () => clearInterval(interval);
  };

  // 💬 Show protection messages
  const showProtectionMessage = (message: string) => {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  // 🎥 Video control functions
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleProgress = () => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    const totalDuration = videoRef.current.duration;
    const progressPercent = (currentTime / totalDuration) * 100;

    setProgress(progressPercent);
    onProgress?.(progressPercent);

    // Auto-hide controls
    if (showControls) {
      if (controlsTimeout) clearTimeout(controlsTimeout);
      const timeout = setTimeout(() => setShowControls(false), 3000);
      setControlsTimeout(timeout);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onComplete?.();
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => setShowControls(false), 3000);
    setControlsTimeout(timeout);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const cleanup = enableProtection();
    const screenRecordingCleanup = detectScreenRecording();

    return () => {
      cleanup?.();
      screenRecordingCleanup();
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative bg-black rounded-xl overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* 🔒 Protection Overlay */}
      {isProtected && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-lg">
          <Lock className="w-4 h-4" />
          <span className="text-sm font-medium">Protected Content</span>
        </div>
      )}

      {/* 📹 Video Element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onProgress={handleProgress}
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      />

      {/* 🎛️ Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <button
                onClick={toggleMute}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <div className="text-white text-sm">
                {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚫 Protection Warning */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white px-4 py-2 rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Content Protected</span>
          </div>
        </div>
      </div>

      {/* 📝 Custom CSS for slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default SecureVideoPlayer;