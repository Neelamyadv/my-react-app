import React from 'react';
import { motion } from 'framer-motion';

const OfferingsSection = () => {
  const offerings = [
    {
      title: 'Exclusive Masterclasses',
      description: 'Learn from industry experts through our exclusive masterclass series'
    },
    {
      title: 'One-Time Subscription',
      description: 'Get lifetime access with a single subscription payment'
    },
    {
      title: 'Key Features',
      description: 'Access to premium learning tools and resources'
    },
    {
      title: 'Internship & Opportunities',
      description: 'Connect with top companies for internship opportunities'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-3xl md:text-5xl font-bold mb-12 sm:mb-16 text-center md:text-left md:ml-8 text-gray-50">
          What we Offer <span className="gradient-text">Here!</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {offerings.map((offering, index) => (
            <motion.div
              key={index}
              className="backdrop-blur-lg bg-white bg-opacity-5 p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-full relative group border border-gray-700"
              whileHover={{ scale: 1.05, borderColor: '#3b82f6', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 right-0 p-2 sm:p-3 text-2xl sm:text-3xl font-extrabold text-white text-opacity-10 group-hover:text-opacity-20 transition-opacity duration-300">
                0{index + 1}
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-xl sm:text-2xl text-white mb-2">{offering.title}</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{offering.description}</p>
              </div>
              <div className="relative mt-6">
                <div className="h-1 bg-blue-600 w-1/4 group-hover:w-full transition-all duration-500 ease-in-out"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferingsSection;