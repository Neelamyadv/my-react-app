// src/components/TrainingSection.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Video, Users } from "lucide-react";

export default function TrainingSection() {
  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Join Our Live Training Program
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Experience interactive, instructor-led sessions with hands-on projects and real-time feedback — learn with a collaborative community.
          </p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3">
              <Video className="w-6 h-6 text-indigo-600" />
              <span>Live & interactive sessions with experts</span>
            </li>
            <li className="flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-600" />
              <span>Collaborative learning environment</span>
            </li>
          </ul>

          <Link
            to="/live-training"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-medium rounded-lg transition"
          >
            Learn More
          </Link>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <img
            src="/images/training.png"
            alt="Live Training Program"
            className="addmax-w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
