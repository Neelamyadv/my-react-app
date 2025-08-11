import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, RefreshCw, AlertTriangle, CheckCircle, Mail, Clock } from 'lucide-react';

const RefundPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-100 to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
          >
            <ChevronLeft size={20} />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Refund & Cancellation Policy</h1>
              <p className="text-gray-600 mt-2">Your satisfaction is important to us</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">
            Zyntiq Cancellation and Refund Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your satisfaction with any product, service, course, or workshop acquired from us is important. Please carefully review the following terms, which outline our policy regarding refunds.
          </p>
        </div>

        {/* Policy Overview */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-purple-900">Important Notice</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Please read this policy carefully before making any purchases. By completing a transaction with Zyntiq, you acknowledge that you have read, understood, and agree to be bound by this refund and cancellation policy.
          </p>
        </div>

        {/* Workshops Policy */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-purple-900">Workshops</h2>
          </div>
          
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Non-Refundable Policy</h3>
                <p className="text-gray-700 leading-relaxed">
                  Please be aware that all payments made for workshops are <strong>non-refundable and non-creditable</strong>. This policy is in place due to the limited seating and preparation required for each workshop session.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-purple-900">Why workshops are non-refundable:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Limited seating capacity requires advance planning and resource allocation</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Materials and resources are prepared specifically for registered participants</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Instructor time and venue arrangements are committed in advance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Policy */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-purple-900">Courses</h2>
          </div>
          
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-orange-900 mb-2">No Refund Policy</h3>
                <p className="text-gray-700 leading-relaxed">
                  Courses are not eligible for refunds. We highly recommend that you assess your availability and commitment before finalizing your enrollment.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Transfer Option Available</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Should your plans change, you may transfer your enrollment to a future cohort. A small administrative fee will apply for such transfers.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-gray-700 text-sm">Transfer requests must be made at least 48 hours before the course start date</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-gray-700 text-sm">Administrative fee: ₹500 per transfer</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-gray-700 text-sm">Maximum of one transfer allowed per enrollment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Circumstances */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-purple-900">Special Circumstances</h2>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            While our general policy is no refunds, we understand that exceptional circumstances may arise. We will consider refund requests on a case-by-case basis for the following situations:
          </p>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Medical Emergencies</h3>
              <p className="text-gray-700 text-sm">Documented medical emergencies that prevent participation (medical certificate required)</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Technical Issues</h3>
              <p className="text-gray-700 text-sm">Persistent technical problems on our end that prevent access to course materials</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Course Cancellation</h3>
              <p className="text-gray-700 text-sm">If we cancel a course or workshop, full refunds will be provided within 7-10 business days</p>
            </div>
          </div>
        </div>

        {/* Refund Process */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-purple-900">Refund Process</h2>
          </div>
          
          <div className="space-y-6">
            <div className="border-l-4 border-purple-300 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 1: Contact Us</h3>
              <p className="text-gray-700">Email us at info@zyntiq.in with your request and supporting documentation</p>
            </div>
            <div className="border-l-4 border-purple-300 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 2: Review Process</h3>
              <p className="text-gray-700">Our team will review your request within 3-5 business days</p>
            </div>
            <div className="border-l-4 border-purple-300 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 3: Decision & Processing</h3>
              <p className="text-gray-700">If approved, refunds will be processed within 7-10 business days to the original payment method</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Contact Information</h2>
          </div>
          <div className="space-y-4">
            <p className="text-white/90 leading-relaxed">
              For any inquiries concerning our refund policy, please reach out to us via email at{' '}
              <a href="mailto:info@zyntiq.in" className="text-white font-medium hover:underline">
                info@zyntiq.in
              </a>
            </p>
            <p className="text-white/90 leading-relaxed">
              Please include your order number, course/workshop name, and detailed reason for your refund request.
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center md:text-left">
              Embrace Education,<br />
              Reach <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">New</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Elevation</span>
            </h2>
            <Link 
              to="/courses"
              className="px-8 py-3 bg-purple-500 rounded-full hover:bg-purple-600 transition-colors font-medium flex items-center gap-2"
            >
              Start Learning
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;