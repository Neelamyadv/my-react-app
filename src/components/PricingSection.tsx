import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, CheckCircle } from 'lucide-react';
const PricingSection = () => {
  const plans = [
    {
      name: 'Basic Plan',
      icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-gray-500" />,
      price: '₹599',
      features: [
        'Subscription to unlimited access to all our courses',
        '5,000+ hours of learning',
        'ISO certified',
        'Access to 100+ upcoming courses in 2025',
        'E-books worth ₹9,999'
      ],
      buttonStyle: 'border-2 border-gray-600 text-gray-500 hover:bg-gray-800/20 hover:text-white',
      link: '/premium-pass'
    },
    {
      name: 'Premium Plan',
      icon: <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" />,
      price: '₹999',
      features: [
        'One-time Subscription 12+ Courses',
        'Best Video Quality',
        'Subscription to unlimited access to all our courses',
        '5,000+ hours of learning',
        'ISO certified',
        'Access to 100+ upcoming courses in 2025',
        'E-books worth ₹9,999'
      ],
      buttonStyle: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg',
      link: '/premium-pass'
    }
  ];
  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-16 yellow-gradient-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-slate-100 leading-tight">
            Pricing Plans <span className="gradient-text">For You</span>
          </h2>
          <p className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto">
            Precision pricing, powerful results.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-px transition-all duration-300 transform ${index === 0 ? 'bg-gray-600/30' : 'bg-gradient-to-r from-purple-400/60 to-indigo-400/60 hover:shadow-2xl hover:-translate-y-2'}`}
            >
              <div className={`rounded-[1.35rem] p-6 sm:p-8 h-full flex flex-col justify-between backdrop-blur-xl bg-gray-950/70 ${index === 0 ? 'border border-gray-700/50' : ''}`}>
                <div className="flex flex-col items-center mb-5 sm:mb-6">
                  <div className="mb-3">{plan.icon}</div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-1 ${index === 0 ? 'text-gray-400' : 'text-gray-100'}`}>{plan.name}</h3>
                  <div className={`flex items-baseline ${index === 0 ? 'text-gray-500' : 'text-white'}`}>
                    <span className="text-3xl sm:text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-lg font-medium ml-1">/ lifetime</span>
                  </div>
                </div>
                <ul className={`space-y-3 sm:space-y-4 mb-6 flex-1 ${index === 0 ? 'text-gray-500' : 'text-gray-300'}`}>
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-1 ${index === 0 ? 'text-gray-500' : 'text-green-400'}`} />
                      <span className="text-sm sm:text-base leading-snug">{feature}</span>
                    </li>
                  ))}
                  {/* The spacer items are removed to make the cards more compact and sleek */}
                </ul>
                <div className="text-center mt-auto">
                  <Link
                    to={plan.link}
                    onClick={() => window.scrollTo(0, 0)}
                    className={`w-full py-3 px-8 rounded-full font-semibold transition-all duration-300 block text-center text-base sm:text-lg ${plan.buttonStyle} ${index === 1 ? 'shadow-md' : 'shadow-none'}`}
                  >
                    Enroll now
                  </Link>
                  <p className={`mt-3 sm:mt-4 text-xs sm:text-sm ${index === 0 ? 'text-gray-500' : 'text-gray-400'}`}>Zyntiq Lifetime Membership</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default PricingSection;