import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { vacTopics } from "../../vacConfig";

export default function VAC_Video() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = vacTopics.find((t) => t.id === topicId);

  const [videoEnded, setVideoEnded] = useState(false);

  if (!topic) {
    return <div className="text-center text-white p-10">Topic not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-6 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-white mb-6">{topic.title}</h1>
      <p className="text-gray-300 mb-8 max-w-2xl text-center">{topic.description}</p>

      <div className="w-full max-w-4xl mb-8">
        <iframe
          className="w-full h-80 rounded-lg shadow-lg"
          src={topic.videoUrl}
          title={topic.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onEnded={() => setVideoEnded(true)}
        ></iframe>
      </div>

      <button
        disabled={!videoEnded}
        onClick={() => navigate(`/value-certificate/quiz/${topic.id}`)}
        className={`px-6 py-3 font-semibold rounded-lg transition-all ${
          videoEnded
            ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:scale-105"
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
      >
        Continue to Quiz
      </button>
    </div>
  );
}
