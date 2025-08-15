// src/components/ValueaddedPage/ValueCert.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ValueCert() {
  const navigate = useNavigate();

  const handleStart = () => {
    // TESTING MODE: mark payment done (replace this with your Razorpay success logic later)
    localStorage.setItem("vac_payment", "true");

    // Optional: save logged user name that will appear on certificate (replace as needed)
    if (!localStorage.getItem("user_name")) {
      localStorage.setItem("user_name", "Student Name");
    }

    navigate("/value-certificate/start");
  };

  return (
    <main className="min-h-screen yellow-gradient-bg p-8">
      <div className="max-w-4xl mx-auto rounded-xl bg-white/5 p-8 border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-4">Zyntiq — Value Added Certificate</h1>
        <p className="text-gray-200 mb-6">
          Earn a verified certificate by watching a short lesson and completing a short quiz.
          Payment unlocks the controlled flow: choose a topic → watch video → take quiz → get certificate.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleStart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
          >
            Enroll & Start
          </button>

          <a href="#features" className="px-6 py-3 rounded-lg border border-white/20 text-white">
            Learn more
          </a>
        </div>
      </div>
    </main>
  );
}
