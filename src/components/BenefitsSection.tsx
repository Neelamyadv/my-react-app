import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Infinity, DollarSign, Award } from 'lucide-react';
const BenefitsSection = () => {
  const benefits = [
    {
      title: 'LEARN AT YOUR PACE',
      description: 'Flexible courses designed to fit your schedule anytime, anywhere.',
      icon: <Clock className="text-white" size={24} />
    },
    {
      title: 'LIFETIME ACCESS',
      description: 'Revisit your courses anytime because learning never stops.',
      icon: <Infinity className="text-white" size={24} />
    },
    {
      title: 'AFFORDABLE',
      description: "High quality education that is accessible anytime.",
      icon: <DollarSign className="text-white" size={24} />
    },
    {
      title: 'CERTIFICATION',
      description: 'Earn credible certificates to boost your resume and career.',
      icon: <Award className="text-white" size={24} />
    }
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0 
    }
  };
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          <motion.div 
            className="text-left lg:w-1/2 w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-neutral-200">
              Discover Our Zyntiq's
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Benefits & Features</span>
            </h2>
            <p className="max-w-xl text-neutral-400 text-base sm:text-lg pr-4">
              In order to create an engaging learning experience, the role of 
              instructor is optional, but the role of learner is essential.
            </p>
          </motion.div>
          <motion.div 
            className="lg:w-1/2 w-full grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="group relative bg-neutral-800 border-2 border-neutral-700 rounded-2xl p-6 flex flex-col items-start transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-neutral-700"
                variants={itemVariants}
                whileHover={{
                  borderColor: '#9333ea',
                  boxShadow: '0 0 20px rgba(147, 51, 234, 0.4)'
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative z-20 w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mb-4 transition-all duration-300">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-lg text-white mb-2 leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default BenefitsSection;