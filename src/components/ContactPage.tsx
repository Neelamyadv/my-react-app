import React, { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { localDB } from '../lib/database';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await localDB.insertContactMessage(formData);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen yellow-gradient-bg py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-100 text-center sm:text-left">
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="text-lg sm:text-xl mb-8 sm:mb-12 text-gray-50 text-center sm:text-left">with me today</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Info Cards */}
          <div className="md:col-span-1 space-y-4 sm:space-y-6">
            <div className="glass-card-dark rounded-2xl p-4 sm:p-6">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-violet-500 mb-3 sm:mb-4" />
              <h3 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">Email us</h3>
              <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 leading-relaxed">
                Our email platform is designed to provide quick and efficient communication at every need.
              </p>
              <a href="mailto:contact@zyntiq.in" className="text-violet-600 text-sm sm:text-base">contact@zyntiq.in</a>
            </div>

            <div className="glass-card-dark rounded-2xl p-4 sm:p-6">
              <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-violet-500 mb-3 sm:mb-4" />
              <h3 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">Call us</h3>
              <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 leading-relaxed">
                Professional assistance, tailored to your needs.
              </p>
              <a href="tel:+919401966440" className="text-violet-600 text-sm sm:text-base">+91 9401966440</a>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="md:col-span-2 glass-card-dark rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">Send us a message</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-base"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone no</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-base"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-base"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-base"
                rows={4}
                required
                disabled={loading}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-3 sm:py-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 text-base"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


export default ContactPage;
