import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Figma, Users, ArrowRight } from 'lucide-react';
const CoursesSection = () => {
  const courses = [
    {
      title: 'Web Development',
      icon: <Monitor className="text-black" size={28} />,
      topics: [
        'Introduction to Web Development',
        'Html & CSS Fundamentals',
        'Java script Fundamentals',
        'Front end & Back end',
        'Responsive Website',
        'And lot more'
      ],
      description: 'Unlock the power of the web: Learn to code, design, and create',
      path: '/courses/web-development'
    },
    {
      title: 'UI/UX Designing',
      icon: <Figma className="text-black" size={28} />,
      topics: [
        'Introduction to UI/UX Design',
        'User Research and Analysis',
        'Information Architecture and Wireframing',
        'Prototyping and Interaction Design',
        'Visual Design Principles',
        'And lot more'
      ],
      description: 'Highlight the transformative nature of UX/UI design, the power of visual communication, and the potential for innovation',
      path: '/courses/ui-ux-design'
    },
    {
      title: 'HR Management',
      icon: <Users className="text-black" size={28} />,
      topics: [],
      description: 'HR professionals are the architects of a positive and productive work environment.',
      path: '/courses/hr-management'
    }
  ];
  const handleNavigation = () => {
    window.scrollTo(0, 0);
  };
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center text-gray-50">
          What will <span className="gradient-text">You Learn?</span>
        </h2>
        <p className="text-center text-sm text-gray-100 mb-8 sm:mb-12 max-w-xl mx-auto px-4">
          In order to create an engaging learning experience, the role of 
          instructor is optional, but the role of learner is essential.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {courses.map((course, index) => (
            <div key={index} className="course-card group">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {course.icon}
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">{course.title}</h3>
              <div className="flex-1 flex flex-col justify-start">
                {course.topics.length > 0 ? (
                  <ul className="space-y-2 mb-4 sm:mb-6">
                    {course.topics.map((topic, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-gray-500 mr-2 mt-1">•</span>
                        <span className="text-xs sm:text-sm leading-relaxed">{topic}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mb-4 sm:mb-6 flex-1 flex items-start">
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                )}
                {course.topics.length > 0 && (
                  <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                    {course.description}
                  </p>
                )}
              </div>
              <Link 
                to={course.path}
                onClick={handleNavigation}
                className="enroll-button mt-auto self-center block text-center text-sm sm:text-base"
              >
                Enroll now
              </Link>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-8 sm:mt-12">
          <Link
            to="/courses"
            onClick={handleNavigation}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 text-sm sm:text-base hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Start Learning <ArrowRight size={16} />
          </Link>
          <Link
            to="/courses"
            onClick={handleNavigation}
            className="bg-gradient-to-r from-white to-purple-50 text-purple-900 border-2 border-purple-300 px-6 py-3 rounded-full font-medium text-center text-sm sm:text-base hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Browse courses
          </Link>
        </div>
      </div>
    </section>
  );
};
export default CoursesSection;