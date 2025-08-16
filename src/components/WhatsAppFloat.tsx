import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppSideTabFloat = ({
  number = '+916291822142',
  message = "Hi! I'm interested in learning more about Zyntiq courses. Can you help me?"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const whatsappUrl = `https://wa.me/${number.replace('+', '')}?text=${encodeURIComponent(message)}`;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);

    // detect mobile
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const handleClick = () => window.open(whatsappUrl, '_blank');

  if (!isVisible) return null;

  // 📱 Mobile Layout → FAB button
  if (isMobile) {
    return (
      <button
        onClick={handleClick}
        aria-label="Chat on WhatsApp"
        className="fixed bottom-4 right-4 z-50 bg-green-500 text-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    );
  }

  // 💻 Desktop Layout → Floating Side Tab
  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleClick}
        aria-label="Chat on WhatsApp"
        className={`flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 
          text-white rounded-l-lg shadow-xl p-3 cursor-pointer transform transition-transform duration-300 
          hover:scale-105 ${isHovered ? "translate-x-0" : "translate-x-[calc(100%-48px)]"}
        `}
      >
        <MessageCircle className="w-6 h-6 flex-shrink-0" />
        <span
          className={`whitespace-nowrap font-semibold transition-opacity duration-300 
          ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          Chat on WhatsApp
        </span>
      </button>
    </div>
  );
};

export default WhatsAppSideTabFloat;
