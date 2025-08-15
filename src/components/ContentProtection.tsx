import React, { useEffect } from 'react';
import { Lock, Shield, AlertTriangle } from 'lucide-react';

interface ContentProtectionProps {
  children: React.ReactNode;
  isActive?: boolean;
}

const ContentProtection: React.FC<ContentProtectionProps> = ({ 
  children, 
  isActive = true 
}) => {
  useEffect(() => {
    if (!isActive) return;

    // 🔒 Global Content Protection
    const enableGlobalProtection = () => {
      // Disable right-click on protected content
      const handleContextMenu = (e: MouseEvent) => {
        // Allow right-click on certain elements (forms, inputs, etc.)
        const target = e.target as HTMLElement;
        const allowedElements = ['input', 'textarea', 'select', 'button', 'a'];
        
        if (allowedElements.includes(target.tagName.toLowerCase()) || 
            target.closest('.allow-right-click')) {
          return;
        }

        e.preventDefault();
        showProtectionMessage('Right-click disabled for content protection');
      };

      // Disable keyboard shortcuts for content theft
      const handleKeyDown = (e: KeyboardEvent) => {
        const blockedKeys = [
          'F11', 'F12', 'PrintScreen', 'PrtScn',
          'Ctrl+c', 'Ctrl+v', 'Ctrl+a', 'Ctrl+s',
          'Ctrl+p', 'Ctrl+u', 'F5', 'Ctrl+r',
          'Ctrl+d', 'Ctrl+n', 'Ctrl+w', 'Ctrl+shift+i',
          'F12', 'Ctrl+shift+c', 'Ctrl+shift+j'
        ];

        const keyCombo = e.ctrlKey ? `Ctrl+${e.key.toLowerCase()}` : e.key;
        
        if (blockedKeys.includes(keyCombo)) {
          e.preventDefault();
          showProtectionMessage('Keyboard shortcut disabled for content protection');
        }
      };

      // Disable text selection on protected content
      const handleSelectStart = (e: Event) => {
        const target = e.target as HTMLElement;
        
        // Allow selection on certain elements
        if (target.closest('.allow-selection') || 
            target.tagName.toLowerCase() === 'input' ||
            target.tagName.toLowerCase() === 'textarea') {
          return;
        }

        e.preventDefault();
      };

      // Disable drag and drop of images and content
      const handleDragStart = (e: DragEvent) => {
        const target = e.target as HTMLElement;
        
        // Allow drag on certain elements
        if (target.closest('.allow-drag') || 
            target.tagName.toLowerCase() === 'input' ||
            target.tagName.toLowerCase() === 'textarea') {
          return;
        }

        e.preventDefault();
        showProtectionMessage('Drag and drop disabled for content protection');
      };

      // Disable copy events
      const handleCopy = (e: ClipboardEvent) => {
        const target = e.target as HTMLElement;
        
        // Allow copy on certain elements
        if (target.closest('.allow-copy') || 
            target.tagName.toLowerCase() === 'input' ||
            target.tagName.toLowerCase() === 'textarea') {
          return;
        }

        e.preventDefault();
        showProtectionMessage('Copying disabled for content protection');
      };

      // Add event listeners
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('selectstart', handleSelectStart);
      document.addEventListener('dragstart', handleDragStart);
      document.addEventListener('copy', handleCopy);

      // Cleanup function
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('selectstart', handleSelectStart);
        document.removeEventListener('dragstart', handleDragStart);
        document.removeEventListener('copy', handleCopy);
      };
    };

    // 🛡️ Screenshot detection (basic)
    const detectScreenshots = () => {
      // Monitor for screen recording attempts
      const checkScreenRecording = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          // This is a basic detection - in production, use more sophisticated methods
          console.log('Screen recording detection active');
        }
      };

      // Check periodically
      const interval = setInterval(checkScreenRecording, 10000);
      return () => clearInterval(interval);
    };

    // 💬 Show protection messages
    const showProtectionMessage = (message: string) => {
      // Remove existing notifications
      const existingNotifications = document.querySelectorAll('.protection-notification');
      existingNotifications.forEach(notification => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      });

      // Create new notification
      const notification = document.createElement('div');
      notification.className = 'protection-notification fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg z-50 shadow-lg flex items-center gap-2';
      notification.innerHTML = `
        <Shield className="w-4 h-4" />
        <span>${message}</span>
      `;
      document.body.appendChild(notification);

      // Auto-remove after 3 seconds
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    };

    // 🚨 DevTools detection
    const detectDevTools = () => {
      const devtools = {
        open: false,
        orientation: null
      };

      const threshold = 160;

      const emitEvent = (isOpen: boolean, orientation?: string) => {
        if (isOpen !== devtools.open) {
          devtools.open = isOpen;
          devtools.orientation = orientation;

          if (isOpen) {
            showProtectionMessage('Developer tools detected - content protection active');
          }
        }
      };

      const main = ({emitEvents = true} = {}) => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        const orientation = widthThreshold ? 'vertical' : 'horizontal';

        if (
          !(heightThreshold && widthThreshold) &&
          ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)
        ) {
          if (emitEvents) {
            emitEvent(true, orientation);
          }
          return true;
        } else {
          if (emitEvents) {
            emitEvent(false);
          }
          return false;
        }
      };

      // Check periodically
      const interval = setInterval(() => main(), 1000);
      return () => clearInterval(interval);
    };

    // Initialize all protection
    const cleanup = enableGlobalProtection();
    const screenshotCleanup = detectScreenshots();
    const devToolsCleanup = detectDevTools();

    return () => {
      cleanup();
      screenshotCleanup();
      devToolsCleanup();
    };
  }, [isActive]);

  return (
    <div className="content-protection-wrapper">
      {/* 🔒 Protection Status Indicator - Only show in development */}
      {isActive && import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 z-40">
          <div className="bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Content Protected</span>
          </div>
        </div>
      )}

      {/* 📝 Protection Notice - Only show in development */}
      {isActive && import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 z-40 max-w-xs">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-yellow-800 font-medium">Content Protection Active</p>
                <p className="text-xs text-yellow-700 mt-1">
                  This content is protected against unauthorized copying and distribution.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎯 Protected Content */}
      <div className={isActive ? 'protected-content' : ''}>
        {children}
      </div>

      {/* 📝 Protection CSS */}
      <style>{`
        .protected-content {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        .protected-content * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        .protected-content .allow-selection,
        .protected-content .allow-selection * {
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }
        
        .protected-content .allow-copy {
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }
        
        .protected-content .allow-drag {
          -webkit-user-drag: element;
          -moz-user-drag: element;
          -ms-user-drag: element;
          user-drag: element;
        }
        
        .protected-content .allow-right-click {
          /* Allow right-click on specific elements */
        }
      `}</style>
    </div>
  );
};

export default ContentProtection;