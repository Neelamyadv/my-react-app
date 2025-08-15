import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { vacTopics } from "../../vacConfig";

export default function VAC_Quiz() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [attempt, setAttempt] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (!localStorage.getItem("vac_payment")) {
      navigate("/value-certificate");
      return;
    }

    const topicId = localStorage.getItem("vac_topic");
    const found = vacTopics.find((t) => t.id === topicId);
    if (!found) {
      navigate("/value-certificate/start");
      return;
    }
    setTopic(found);

    const savedAttempt = parseInt(localStorage.getItem("vac_attempt") || "0", 10);
    setAttempt(savedAttempt);
  }, [navigate]);

  const handleOptionSelect = (qIndex: number, optIndex: number) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = () => {
    if (!topic) return;

    // ensure all answered
    const total = topic.questions.length;
    const answered = Object.keys(answers).length;
    if (answered < total) {
      alert(`Please answer all ${total} questions.`);
      return;
    }

    let correctCount = 0;
    topic.questions.forEach((q: any, index: number) => {
      if (answers[index] === q.answer) correctCount++;
    });

    const percent = (correctCount / total) * 100;
    setScore(percent);
    setSubmitted(true);

    // Save attempt
    const newAttempt = attempt + 1;
    setAttempt(newAttempt);
    localStorage.setItem("vac_attempt", newAttempt.toString());

    // Pass check
    if (percent >= 50) {
      if (newAttempt === 1) {
        localStorage.setItem("vac_pass", "true");
        navigate("/value-certificate/certificate");
      } else {
        alert("Pass! But certificate will not be issued (second attempt).");
      }
    } else {
      if (newAttempt >= 2) {
        alert("Failed! No more attempts left.");
      } else {
        alert("Failed! You can try once more.");
      }
    }
  };

  if (!topic) return null;

  const totalQ = topic.questions?.length || 0;
  const answeredQ = Object.keys(answers).length;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Quiz – {topic.name}</h2>
        <span className="text-sm text-gray-600">
          Attempt: <b>{attempt + 1}</b>/2
        </span>
      </div>

      {topic.questions.map((q: any, qIndex: number) => (
        <div key={qIndex} className="mb-6">
          <p className="font-medium mb-2">{q.q}</p>
          {q.options.map((opt: string, optIndex: number) => (
            <label key={optIndex} className="block">
              <input
                type="radio"
                name={`q-${qIndex}`}
                checked={answers[qIndex] === optIndex}
                onChange={() => handleOptionSelect(qIndex, optIndex)}
              />
              <span className="ml-2">{opt}</span>
            </label>
          ))}
        </div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
          disabled={answeredQ < totalQ}
          title={answeredQ < totalQ ? "Answer all questions to submit" : "Submit"}
        >
          Submit Quiz
        </button>
      )}

      {submitted && (
        <p className="mt-4">
          Your Score: <b>{score.toFixed(0)}%</b>
        </p>
      )}
    </div>
  );
}
