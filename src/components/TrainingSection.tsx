// src/components/TrainingSection.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Video, Users, CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function TrainingSection() {
  return (
    // Reduced bottom padding to remove awkward gap to next section
    <section className="w-full pt-16 pb-6 yellow-gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">

        {/* Left: Text on glass card */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Accent badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-4 shadow">
            <Video className="w-5 h-5" />
            <span className="text-sm font-medium">Live Training Program</span>
          </div>

          {/* Glass card for readability */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              Learn Live with Mentors. Build Real Projects. Get Results.
            </h2>

            <p className="text-gray-200 md:text-lg mb-6">
              Interactive, mentor-led sessions with hands-on practice, real-time feedback, and a supportive peer community — designed to make learning faster and outcomes stronger.
            </p>

            {/* Highlights */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-300 mt-0.5" />
                <span className="text-gray-200">Live & interactive classes with expert mentors</span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-6 h-6 text-indigo-300 mt-0.5" />
                <span className="text-gray-200">Collaborative learning with doubt support</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-cyan-300 mt-0.5" />
                <span className="text-gray-200">Structured schedule with flexible timings</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-pink-300 mt-0.5" />
                <span className="text-gray-200">Project-driven outcomes + Value Added Certificate</span>
              </li>
            </ul>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/live-training"
                className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
              >
                Explore Live Program
              </Link>
              <Link
                to="/live-training"
                className="px-6 py-3 rounded-lg border border-white/40 hover:border-white/60 text-white font-medium transition"
              >
                View Certificate
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Right: Visual block (16:9 style) */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
            {/* Decorative glow */}
            <div className="absolute -inset-24 bg-[radial-gradient(60%_40%_at_30%_20%,rgba(255,255,255,0.35),transparent),radial-gradient(50%_50%_at_80%_70%,rgba(255,255,255,0.25),transparent)]" />
            {/* Image */}
            <img
              src="/images/live-training-preview.png"
              alt="Live Training Program"
              className="absolute inset-0 h-full w-full object-cover opacity-95"
            />
            {/* Overlay label */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="px-3 py-1 rounded-md bg-black/40 text-white text-xs md:text-sm border border-white/10">
                Live Sessions • Mentors • Projects
              </div>
              <div className="px-3 py-1 rounded-md bg-black/40 text-white text-xs md:text-sm border border-white/10">
                Zyntiq
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
