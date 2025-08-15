// src/components/ValuedCertificate.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export default function ValuedCertificate() {
  return (
    // Reduced top padding so it sits closer to TrainingSection
    <section className="w-full pt-6 pb-16 yellow-gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
        {/* Left: Text (60%) */}
        <motion.div
          className="md:col-span-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-4 shadow">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium">Value Added Certificate</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            Earn a Valued Certificate That Signals Real-World Readiness
          </h2>

          <p className="text-lg text-gray-200 mb-6">
            Stand out with a certificate that reflects practical mastery, portfolio‑ready work, and instructor‑validated skills — recognized by learners and hiring teams alike.
          </p>

          {/* Feature highlights */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-300 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Verified by Experts</p>
                <p className="text-gray-300 text-sm">Assessed on projects, not just quizzes — ensuring true skill demonstration.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-indigo-300 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Shareable & Trackable</p>
                <p className="text-gray-300 text-sm">Add to LinkedIn, resumes, and portfolios with easy verification links.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-pink-300 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Project‑Backed Credibility</p>
                <p className="text-gray-300 text-sm">Every certificate is tied to completed, feedback‑driven projects.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-300 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Lifetime Access</p>
                <p className="text-gray-300 text-sm">Keep your achievements and evidence of work accessible forever.</p>
              </div>
            </li>
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/certificate"
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
            >
              View Certificate Details
            </Link>
            <Link
              to="/certificate"
              className="px-6 py-3 rounded-lg border border-white/40 hover:border-white/60 text-white font-medium transition"
            >
              Earn with Live Training
            </Link>
          </div>
        </motion.div>

        {/* Right: Visual (40%) in strict 16:9 */}
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* 16:9 container */}
          <div className="relative w-full rounded-xl overflow-hidden shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 aspect-[16/9]">
            {/* Mock certificate card overlay */}
            <div className="absolute inset-3 md:inset-4 bg-white/95 rounded-lg shadow-md flex flex-col p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-6 h-6 text-indigo-600" />
                <p className="font-semibold text-gray-900">Zyntiq Certificate</p>
              </div>
              <div className="h-px bg-gray-200 mb-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Awarded To</p>
                <p className="font-semibold text-gray-900">[Recipient Name]</p>
                <p className="text-sm text-gray-500 mt-3 mb-1">Credential</p>
                <p className="text-gray-900">Value Added Certificate of Completion</p>
                <p className="text-xs text-gray-500 mt-2">Validated by Instructor Panel • Project‑based Assessment</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-500">Issued by Zyntiq</div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded" />
                  <div className="h-6 w-16 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
