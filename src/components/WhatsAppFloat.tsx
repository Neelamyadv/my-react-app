import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
const WhatsAppSideTabFloat = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const whatsappNumber = '+916291822142';
  const message = encodeURIComponent('Hi! I\'m interested in learning more about Zyntiq courses. Can you help me?');
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`;
  useEffect(() => {
    // Show the tab after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };
  if (!isVisible) return null;
  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 transform transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-l-lg shadow-xl p-3 cursor-pointer transform transition-transform duration-300 hover:scale-105 ${
          isHovered ? 'translate-x-0' : 'translate-x-[calc(100%-48px)]'
        }`}
        onClick={handleClick}
      >
        <MessageCircle className="w-6 h-6 flex-shrink-0" />
        <span
          className={`whitespace-nowrap font-semibold transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Chat on WhatsApp
        </span>
      </div>
    </div>
  );
};
export default WhatsAppSideTabFloat;