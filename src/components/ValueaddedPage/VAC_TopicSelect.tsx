import React from "react";
import { useNavigate } from "react-router-dom";
import { vacTopics } from "../../vacConfig";


export default function VAC_TopicSelect() {
  const navigate = useNavigate();

  const selectTopic = (id: string) => {
    localStorage.setItem("vac_topic", id);
    navigate("/value-certificate/video");
  };

  React.useEffect(() => {
    if (!localStorage.getItem("vac_payment")) {
      navigate("/value-certificate");
    }
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Choose a Topic</h2>
      <div className="space-y-4">
        {vacTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => selectTopic(topic.id)}
            className="w-full bg-gray-200 p-4 rounded-lg hover:bg-gray-300"
          >
            {topic.name}
          </button>
        ))}
      </div>
    </div>
  );
}
