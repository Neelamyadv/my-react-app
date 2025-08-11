import React from 'react';
import { Target, BookOpen, GraduationCap } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen yellow-gradient-bg">
      {/* Hero Section */}
      <div className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Image Placeholder */}
            <div className="relative order-2 lg:order-1 flex justify-center items-center">
              {/* Replace 'your-image-placeholder.jpg' with your actual image path */}
              <img
                src="images\clrglobe.png"
                alt="Description of your image"
                className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-cover rounded-2xl sm:rounded-3xl floating-delay-1"
              />
            </div>
            
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <span className="inline-block px-3 sm:px-4 py-2 bg-blue-50/80 backdrop-blur-sm text-xs sm:text-sm rounded-full mb-4 sm:mb-6 border border-blue-200/50">
                About Zyntiq
              </span>
              <h1 className="text-5xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-50 leading-tight">
                Welcome to Zyntiq for your skills with best Online Courses.
              </h1>
              <div className="space-y-3 sm:space-y-4 text-gray-100 text-sm sm:text-base">
                <p>
                  At Zyntiq, we believe the next generation deserves more than yesterday's ideas.
                </p>
                <p>
                  We exist to energize, empower, and equip forward-thinkers to thrive in a rapidly changing world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Innovation Section */}
      <div className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center lg:text-left">
          <h2 className="text-4xl sm:text-6xl font-bold mb-3 sm:mb-4 text-black">
            <span className="text-gray-50">Innovation</span>
          </h2>
          <p className="text-gray-100 max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base leading-relaxed font-medium">
            is no longer optional — it's essential. That's why we design learning experiences, tools, and opportunities that are dynamic, adaptive, and built for real-world impact.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            <div className="glass-card-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg sm:text-2xl font-bold text-purple-600 mb-3 sm:mb-4">Our Mission</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                To inspire individuals and organizations to grow beyond boundaries, challenge convention, and drive meaningful progress.
              </p>
            </div>
            <div className="glass-card-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg sm:text-2xl font-bold text-purple-600 mb-3 sm:mb-4">Our Vision</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Is Simple With a commitment to innovation, community, and continuous improvement, we're building more than just a learning platform—we're shaping a global learning experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certification Section */}
      <div className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 sm:mb-12 text-gray-50">We are Certified</h2>
          <p className="text-gray-300 max-w-6xl mx-auto mb-10 sm:mb-15 text-sm sm:text-base leading-relaxed px-4">
            Zyntiq is an ISO-certified organization, dedicated to upholding the highest standards of quality, reliability, and continuous improvement. Our certification reflects our commitment to delivering services that meet global benchmarks for excellence and operational efficiency. At Zyntiq, we follow structured processes and best practices to ensure our clients receive consistent, secure, and value-driven solutions. This recognition not only reinforces our credibility but also demonstrates our dedication to fostering trust and long-term partnerships.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8">
            <img src="images\certification.png" alt="ISO" className="h-12 sm:h-16" />
          </div>
        </div>
      </div>

      {/* What we Stand for */}
      <div className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-gray-50 text-center lg:text-left">What we Stand for</h2>
          
          <h3 className="text-lg sm:text-xl font-superbold mb-8 sm:mb-12 text-gray-300 text-center lg:text-left">
            Our expertise allows us to offer the finest carrier
          </h3>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="space-y-8 sm:space-y-12">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-2 text-stone-50">Partnered with Top Institutions</h4>
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                    Learn from collaborations with leading universities and companies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-2 text-stone-50">Real-World Use Cases</h4>
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                    Case studies and scenario-based training to prepare you for actual challenges.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-2 text-stone-50">Inclusive & Diverse Learning</h4>
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                    A learning environment that welcomes every background and perspective.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <img 
                src="https://cdn3d.iconscout.com/3d/premium/thumb/woman-working-on-laptop-5706070-4755619.png" 
                alt="Working Professional" 
                className="w-full max-w-xs sm:max-w-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Educational Philosophy */}
      <div className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-purple-200 font-medium mb-2 block text-sm sm:text-base">Our Educational Philosophy</span>
          <h2 className="text-3xl sm:text-3xl font-bold mb-8 sm:mb-12 text-gray-100">How does Zyntiq Works?</h2>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-900" />,
                title: 'Discover Your Path',
                description: 'Explore personalized course recommendations tailored to your goals and interests.',
                quote: '"Every big journey begins with a spark of curiosity."'
              },
              {
                icon: <Target className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-600" />,
                title: 'Enroll & Engage',
                description: 'Join live sessions, access resources, and interact with mentors in real-time.',
                quote: '"Learning thrives in active participation."'
              },
              {
                icon: <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-600" />,
                title: 'Apply & Achieve',
                description: 'Use your new skills in real-world projects and earn certifications that matter.',
                quote: '"Turn knowledge into action and watch your future unfold."'
              }
            ].map((step, index) => (
              <div key={index} className="glass-card-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <div className="flex justify-center mb-4 sm:mb-6">{step.icon}</div>
                <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">{step.title}</h4>
                <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">{step.description}</p>
                <p className="text-xs sm:text-sm text-gray-600 italic">{step.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-black text-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Embrace Education,<br />
              Reach <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">New</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Elevation</span>
            </h2>
            <button className="px-6 sm:px-8 py-3 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors text-sm sm:text-base font-medium min-h-[48px]">
              Start Learning →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;