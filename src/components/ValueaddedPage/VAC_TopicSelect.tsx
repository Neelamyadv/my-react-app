import React from "react";
import { useNavigate } from "react-router-dom";
import { vacTopics } from "../../vacConfig";

export default function VAC_TopicSelect() {
  const navigate = useNavigate();

  const handleSelect = (topicId: string) => {
    navigate(`/value-certificate/video/${topicId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-blue-900 to-black px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
          Choose Your <span className="text-indigo-400">Course</span>
        </h1>
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
          Select a course to start learning. Watch the video and take the quiz to earn your Value Added Certificate.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {vacTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:shadow-2xl 
                       transition-all duration-300 border border-white/20 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">{topic.title}</h2>
              <p className="text-gray-300 text-sm mb-6">{topic.description}</p>
            </div>
            <button
              onClick={() => handleSelect(topic.id)}
              className="mt-auto px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 
                         text-white font-semibold rounded-lg shadow-lg hover:scale-[1.03] 
                         transition-transform duration-300"
            >
              Start Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
