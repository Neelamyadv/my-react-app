import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms of Service', path: '/terms-of-service' },
    { name: 'Refund Policy', path: '/refund-policy' },
    { name: 'Support', path: '/support' }
  ];

  return (
    <footer className="conic-gradient-footer text-gray-200 pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="images\whitelogomain.png" 
                alt="Zyntiq Logo" 
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>
            <p className="text-gray-200 mb-4 text-sm sm:text-base leading-relaxed font-medium">
              Zyntiq is an online education platform dedicated to helping professionals acquire new skills and advance their careers.
            </p>
            <div className="flex gap-3">
        
              <a 
                href="https://www.instagram.com/zyntiq_official?utm_source=qr&igsh=a3d3cGFtb3hudWpi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors enhanced-shadow"
              >
                <Instagram size={16} className="text-gray-700" />
              </a>
              <a 
                href="https://www.linkedin.com/company/zyntiq/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors enhanced-shadow"
              >
                <Linkedin size={16} className="text-gray-700" />
              </a>
            </div>
          </div>
          
          {/* Legal & Support - Shifted to the right with margin */}
          <div className="lg:ml-8">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Legal & Support</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-200 hover:text-purple-300 transition-colors text-sm sm:text-base font-medium"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-200">Contact Info</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-center gap-3">
                <Mail className="text-gray-200 flex-shrink-0" size={18} />
                <a href="mailto:contact@zyntiq.in" className="text-gray-200 hover:text-purple-300 transition-colors text-sm sm:text-base font-medium">
                  contact@zyntiq.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-gray-200 flex-shrink-0" size={18} />
                <a href="tel:+919401966440" className="text-gray-200 hover:text-purple-300 transition-colors text-sm sm:text-base font-medium">
                  +91 94019 66440
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200/30 pt-6 sm:pt-8">
          <p className="text-center text-gray-200 text-sm font-medium">
            © {new Date().getFullYear()} Zyntiq. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;