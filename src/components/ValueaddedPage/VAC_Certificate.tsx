import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function VAC_Certificate() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("vac_payment") || localStorage.getItem("vac_pass") !== "true") {
      navigate("/value-certificate");
      return;
    }
  }, [navigate]);

  const handleDownload = () => {
    const name = localStorage.getItem("user_name") || "Student";
    const topic = localStorage.getItem("vac_topic_name") || "Course";
    const date = new Date().toLocaleDateString();
    const certId = `ZYN-${Math.floor(100000 + Math.random() * 900000)}`;

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Zyntiq", 105, 30, { align: "center" });
    doc.setFontSize(16);
    doc.text("Value Added Certificate of Completion", 105, 50, { align: "center" });

    doc.setFontSize(12);
    doc.text(`This is to certify that`, 105, 70, { align: "center" });
    doc.setFontSize(18);
    doc.text(name, 105, 80, { align: "center" });

    doc.setFontSize(12);
    doc.text(`has successfully completed`, 105, 90, { align: "center" });
    doc.setFontSize(16);
    doc.text(topic, 105, 100, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Date: ${date}`, 20, 130);
    doc.text(`Certificate ID: ${certId}`, 20, 140);

    doc.save(`certificate-${certId}.pdf`);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">🎉 Congratulations!</h2>
      <p className="mb-6">
        You have successfully completed your Value Added Certificate course.
      </p>
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Download Certificate
      </button>
    </div>
  );
}
