import React, { useRef } from 'react';
import { X, Download, Share2, Award } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
}

const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  courseName,
  completionDate,
  certificateId
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadCertificate = async () => {
    try {
      // Create a high-resolution canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Could not get canvas context');
        fallbackDownload();
        return;
      }

      // Set high resolution for better quality
      const scale = 2;
      canvas.width = 1200 * scale;
      canvas.height = 800 * scale;
      ctx.scale(scale, scale);

      // Load the certificate template image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Draw the certificate template
          ctx.drawImage(img, 0, 0, 1200, 800);
          
          // Set text properties for better rendering
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#2d3748';
          
          // Student name - positioned above the line
          ctx.font = 'bold 48px "Times New Roman", serif';
          ctx.fillText(studentName, 600, 380);
          
          // Course name - positioned below the line  
          ctx.font = 'bold 32px "Times New Roman", serif';
          ctx.fillText(courseName, 600, 460);
          
          // Date
          ctx.font = '24px "Times New Roman", serif';
          ctx.fillText(formatDate(completionDate), 600, 580);
          
          // Certificate ID
          ctx.font = '18px "Arial", sans-serif';
          ctx.fillText(`Certificate ID: ${certificateId}`, 600, 720);
          
          // Convert to blob and download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${courseName.replace(/[^a-zA-Z0-9]/g, '-')}-Certificate-${studentName.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            } else {
              fallbackDownload();
            }
          }, 'image/png', 1.0);
          
        } catch (error) {
          console.error('Error drawing on canvas:', error);
          fallbackDownload();
        }
      };
      
      img.onerror = () => {
        console.error('Failed to load certificate image');
        fallbackDownload();
      };
      
      // Try to load the certificate image
      img.src = '/image copy copy copy copy.png';
      
    } catch (error) {
      console.error('Error in downloadCertificate:', error);
      fallbackDownload();
    }
  };

  const fallbackDownload = () => {
    // Fallback: Create a simple certificate using HTML2Canvas approach
    if (certificateRef.current) {
      // Use the browser's built-in screenshot capability
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Certificate - ${studentName}</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: 'Times New Roman', serif;
                background: white;
              }
              .certificate {
                width: 800px;
                height: 600px;
                margin: 0 auto;
                background-image: url('/image copy copy copy copy.png');
                background-size: cover;
                background-position: center;
                position: relative;
                border: 2px solid #ccc;
              }
              .student-name {
                position: absolute;
                top: 48%;
                left: 50%;
                transform: translateX(-50%);
                font-size: 36px;
                font-weight: bold;
                color: #2d3748;
                text-align: center;
              }
              .course-name {
                position: absolute;
                top: 58%;
                left: 50%;
                transform: translateX(-50%);
                font-size: 24px;
                font-weight: bold;
                color: #4a5568;
                text-align: center;
              }
              .date {
                position: absolute;
                top: 72%;
                left: 50%;
                transform: translateX(-50%);
                font-size: 18px;
                color: #718096;
                text-align: center;
              }
              .cert-id {
                position: absolute;
                top: 90%;
                left: 50%;
                transform: translateX(-50%);
                font-size: 14px;
                color: #a0aec0;
                text-align: center;
                font-family: monospace;
              }
              @media print {
                body { margin: 0; padding: 0; }
                .certificate { border: none; }
              }
            </style>
          </head>
          <body>
            <div class="certificate">
              <div class="student-name">${studentName}</div>
              <div class="course-name">${courseName}</div>
              <div class="date">${formatDate(completionDate)}</div>
              <div class="cert-id">Certificate ID: ${certificateId}</div>
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 1000);
              };
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const shareCertificate = async () => {
    const shareText = `🎓 I've successfully completed the ${courseName} course and earned my certificate from Zyntiq!

📅 Completed: ${formatDate(completionDate)}
🆔 Certificate ID: ${certificateId}
🏫 Issued by: Zyntiq

#Zyntiq #OnlineLearning #Certificate #${courseName.replace(/\s+/g, '')}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${courseName} Certificate`,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing certificate:', error);
        // Fallback: copy to clipboard when Web Share API fails
        try {
          await navigator.clipboard.writeText(shareText);
          alert('Certificate details copied to clipboard!');
        } catch (clipboardError) {
          console.error('Failed to copy to clipboard:', clipboardError);
          alert('Unable to share or copy certificate details. Please try again.');
        }
      }
    } else {
      // Fallback: copy to clipboard when Web Share API is not available
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Certificate details copied to clipboard!');
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError);
        alert('Unable to copy certificate details. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Course Certificate</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Certificate Display */}
        <div className="p-4 sm:p-6">
          <div
            ref={certificateRef}
            className="relative w-full max-w-4xl mx-auto"
          >
            {/* Certificate Image Container */}
            <div className="relative w-full bg-gray-100 rounded-xl overflow-hidden">
              <img 
                src="/image copy copy copy copy.png"
                alt="Certificate of Completion" 
                className="w-full h-auto"
                style={{ 
                  maxHeight: '70vh', 
                  objectFit: 'contain',
                  display: 'block'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.log('Image failed to load:', target.src);
                  // Try fallback
                  if (!target.src.includes('placeholder')) {
                    target.src = 'https://via.placeholder.com/800x600/f0f9ff/1e40af?text=Certificate+Template';
                  }
                }}
                onLoad={() => {
                  console.log('Certificate image loaded successfully');
                }}
              />
              
              {/* Text Overlay - Positioned to match your certificate exactly */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {/* Student Name - Above the line */}
                <div 
                  className="absolute font-bold text-gray-800 text-center max-w-[70%] break-words"
                  style={{ 
                    top: '48%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    fontSize: 'clamp(1.5rem, 4.5vw, 3.5rem)',
                    lineHeight: '1.1',
                    fontFamily: '"Times New Roman", serif',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                  }}
                >
                  {studentName}
                </div>
                
                {/* Course Name - Below the line */}
                <div 
                  className="absolute font-semibold text-gray-700 text-center max-w-[80%] break-words"
                  style={{ 
                    top: '58%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    fontSize: 'clamp(1rem, 3.2vw, 2.2rem)',
                    lineHeight: '1.2',
                    fontFamily: '"Times New Roman", serif',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                  }}
                >
                  {courseName}
                </div>
                
                {/* Date */}
                <div 
                  className="absolute text-gray-600 text-center"
                  style={{ 
                    top: '72%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    fontSize: 'clamp(0.8rem, 2.5vw, 1.6rem)',
                    fontFamily: '"Times New Roman", serif',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                  }}
                >
                  {formatDate(completionDate)}
                </div>
                
                {/* Certificate ID */}
                <div 
                  className="absolute text-gray-500 font-mono text-center"
                  style={{ 
                    top: '90%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    fontSize: 'clamp(0.6rem, 1.8vw, 1.2rem)',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                  }}
                >
                  Certificate ID: {certificateId}
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Certificate Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Student:</span>
                  <span className="ml-2 text-blue-700">{studentName}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Course:</span>
                  <span className="ml-2 text-blue-700">{courseName}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Completed:</span>
                  <span className="ml-2 text-blue-700">{formatDate(completionDate)}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Certificate ID:</span>
                  <span className="ml-2 text-blue-700 font-mono">{certificateId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={downloadCertificate}
            className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 min-h-[48px]"
          >
            <Download size={20} />
            <span className="text-sm sm:text-base">Download Certificate</span>
          </button>
          <button
            onClick={shareCertificate}
            className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border-2 border-purple-300 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-colors min-h-[48px]"
          >
            <Share2 size={20} />
            <span className="text-sm sm:text-base">Share Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;