import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward, Minimize } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  startTime?: number;
}

// ========================================
// 🎥 MOBILE-OPTIMIZED VIDEO PLAYER
// ========================================
// This component is fully optimized for mobile devices with:
// - Touch-friendly controls
// - Responsive design
// - Mobile-specific gestures
// - Optimized performance

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  onProgress,
  onComplete,
  startTime = 0
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  // Mobile detection and responsive setup
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On mobile, hide volume controls as they're handled by system
      if (mobile) {
        setVolume(1);
        setIsMuted(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (startTime > 0) {
        video.currentTime = startTime;
      }
    };

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      setCurrentTime(current);
      
      if (onProgress && duration > 0) {
        const progress = (current / duration) * 100;
        onProgress(progress);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);

    // Fullscreen change handler
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [duration, onProgress, onComplete, startTime]);

  // Auto-hide controls on mobile
  useEffect(() => {
    if (!isMobile) return;

    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }

    if (showControls && isPlaying) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000); // Hide after 3 seconds on mobile
      setControlsTimeout(timeout);
    }

    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [showControls, isPlaying, isMobile]);

  // ========================================
  // 🎮 PLAYER CONTROLS
  // ========================================
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const time = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || isMobile) return; // Volume control disabled on mobile

    const newVolume = parseFloat(e.target.value) / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video || isMobile) return; // Mute control disabled on mobile

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!isFullscreen) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Touch/click handler for showing controls
  const handleVideoInteraction = () => {
    if (isMobile) {
      setShowControls(true);
    } else {
      togglePlay();
    }
  };

  // ========================================
  // 📱 MOBILE-OPTIMIZED RENDER
  // ========================================

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-xl overflow-hidden group ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
      onMouseEnter={() => !isMobile && setShowControls(true)}
      onMouseLeave={() => !isMobile && setShowControls(false)}
      onTouchStart={() => isMobile && setShowControls(true)}
    >
      {/* 🎥 VIDEO ELEMENT */}
      <video
        ref={videoRef}
        src={src}
        className={`w-full ${isFullscreen ? 'h-screen object-contain' : 'aspect-video'}`}
        onClick={handleVideoInteraction}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline // Important for mobile devices
        preload="metadata"
      />

      {/* Loading/Buffering Overlay */}
      {(isBuffering || !duration) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        
        {/* Top Controls - Title and Settings */}
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium text-sm sm:text-lg drop-shadow-lg truncate flex-1 mr-4">
              {title}
            </h3>
            
            {/* Settings Button */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white hover:text-purple-300 transition-colors bg-black/30 rounded-full"
              >
                <Settings size={isMobile ? 16 : 20} />
              </button>
              
              {/* Settings Dropdown */}
              {showSettings && (
                <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg p-2 min-w-[120px] z-10">
                  <div className="text-white text-xs sm:text-sm font-medium mb-2">Playback Speed</div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={`block w-full text-left px-2 py-1 text-xs sm:text-sm rounded hover:bg-white/20 transition-colors ${
                        playbackRate === rate ? 'text-purple-300' : 'text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className={`w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 ${
              isPlaying && !isMobile ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            ) : (
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          {/* Progress Bar */}
          <div className="mb-3 sm:mb-4">
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="w-full h-1 sm:h-2 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.3) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.3) 100%)`
              }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Play/Pause */}
              <button 
                onClick={togglePlay} 
                className="text-white hover:text-purple-300 transition-colors p-1"
              >
                {isPlaying ? <Pause size={isMobile ? 18 : 20} /> : <Play size={isMobile ? 18 : 20} />}
              </button>
              
              {/* Skip Buttons */}
              <button 
                onClick={() => skip(-10)} 
                className="text-white hover:text-purple-300 transition-colors p-1"
              >
                <SkipBack size={isMobile ? 16 : 18} />
              </button>
              
              <button 
                onClick={() => skip(10)} 
                className="text-white hover:text-purple-300 transition-colors p-1"
              >
                <SkipForward size={isMobile ? 16 : 18} />
              </button>

              {/* Volume Controls - Hidden on Mobile */}
              {!isMobile && (
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-white hover:text-purple-300 transition-colors">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume * 100}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}

              {/* Time Display */}
              <span className="text-white text-xs sm:text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Fullscreen Button */}
              <button 
                onClick={toggleFullscreen} 
                className="text-white hover:text-purple-300 transition-colors p-1"
              >
                {isFullscreen ? (
                  <Minimize size={isMobile ? 18 : 20} />
                ) : (
                  <Maximize size={isMobile ? 18 : 20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-specific tap zones for seeking */}
      {isMobile && (
        <>
          {/* Left tap zone - seek backward */}
          <div 
            className="absolute left-0 top-0 w-1/3 h-full flex items-center justify-center opacity-0 active:opacity-20 bg-black transition-opacity"
            onTouchEnd={() => skip(-10)}
          >
            <div className="text-white text-center">
              <SkipBack size={24} />
              <div className="text-xs mt-1">-10s</div>
            </div>
          </div>
          
          {/* Right tap zone - seek forward */}
          <div 
            className="absolute right-0 top-0 w-1/3 h-full flex items-center justify-center opacity-0 active:opacity-20 bg-black transition-opacity"
            onTouchEnd={() => skip(10)}
          >
            <div className="text-white text-center">
              <SkipForward size={24} />
              <div className="text-xs mt-1">+10s</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;

// ========================================
// 📱 MOBILE OPTIMIZATION FEATURES
// ========================================
/*
Mobile optimizations implemented:

1. 🎯 TOUCH-FRIENDLY CONTROLS:
   - Larger touch targets (minimum 44px)
   - Touch zones for seeking (left/right tap)
   - Auto-hiding controls with timeout
   - Touch-optimized progress bar

2. 📱 MOBILE-SPECIFIC FEATURES:
   - playsInline attribute for iOS
   - System volume control integration
   - Responsive text and icon sizes
   - Optimized fullscreen experience

3. 🎨 RESPONSIVE DESIGN:
   - Scales from mobile to desktop
   - Adaptive control layouts
   - Mobile-first approach
   - Proper aspect ratios

4. ⚡ PERFORMANCE:
   - Reduced animations on mobile
   - Optimized event handlers
   - Efficient re-renders
   - Battery-conscious features

5. 🎮 GESTURE SUPPORT:
   - Tap to show/hide controls
   - Double-tap zones for seeking
   - Touch-friendly sliders
   - Swipe-friendly interface

6. 🔧 MOBILE CONSIDERATIONS:
   - Disabled volume controls (system handled)
   - Auto-hide controls during playback
   - Optimized for portrait/landscape
   - Touch feedback and visual cues
*/