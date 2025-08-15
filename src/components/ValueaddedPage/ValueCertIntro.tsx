import React from "react";
import { useNavigate } from "react-router-dom";

export default function ValueCertIntro() {
  const navigate = useNavigate();

  // Payment success handler (currently unused but kept for future use)
  // const handlePaymentSuccess = () => {
  //   localStorage.setItem("vac_payment", "true");
  //   navigate("/value-certificate/start");
  // };

  const startPayment = () => {
  // Payment skip for testing
  localStorage.setItem("vac_payment", "true");
  navigate("/value-certificate/start");
};

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Value Added Certificate</h1>
      <p className="mb-6 text-gray-600">
        Enroll now to get certified. Watch the video, pass the quiz, and earn your certificate.
      </p>
      <button
        onClick={startPayment}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Pay & Start
      </button>
    </div>
  );
}
