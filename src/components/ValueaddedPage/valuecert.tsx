// src/components/ValueaddedPage/valuecert.tsx
import React from "react";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Sparkles, Share2, BadgeCheck, Trophy, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function ValueCert() {
  return (
    <main className="min-h-screen yellow-gradient-bg">
      {/* HERO */}
      <section className="w-full pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          {/* Text */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-4 shadow">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Zyntiq Value Added Certificate</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              A Certificate That Proves Skills, Not Just Completion
            </h1>

            <p className="text-lg text-gray-200 mb-6 max-w-2xl">
              Earn a credential backed by real projects, expert evaluation, and verifiable links — designed to impress hiring teams and elevate professional profiles.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/live-training"
                className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
              >
                Earn with Live Training
              </Link>
              <a
                href="#features"
                className="px-6 py-3 rounded-lg border border-white/40 hover:border-white/60 text-white font-medium transition"
              >
                Explore Features
              </a>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
              {/* Glow */}
              <div className="absolute -inset-20 bg-[radial-gradient(60%_40%_at_30%_20%,rgba(255,255,255,0.35),transparent),radial-gradient(50%_50%_at_80%_70%,rgba(255,255,255,0.25),transparent)]" />
              {/* Certificate Card */}
              <div className="absolute inset-4 bg-white/95 rounded-xl shadow-lg ring-1 ring-black/5 p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-6 h-6 text-indigo-600" />
                  <p className="font-semibold text-gray-900">Zyntiq Certificate</p>
                </div>
                <div className="h-px bg-gray-200 mb-3" />
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Recipient</p>
                    <p className="font-semibold text-gray-900">[Your Name]</p>
                    <p className="text-xs text-gray-500 mt-3 mb-1">Credential</p>
                    <p className="text-gray-900">Value Added Certificate of Completion</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Validation</p>
                    <p className="text-gray-900">Project-based Assessment</p>
                    <p className="text-xs text-gray-500 mt-3 mb-1">Issued By</p>
                    <p className="text-gray-900">Zyntiq</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-500">Verified • Shareable • Trackable</div>
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

      {/* Stats */}
      <section className="w-full py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 px-4">
          <StatCard number="10,000+" label="Certificates Issued" />
          <StatCard number="95%" label="Learner Satisfaction" />
          <StatCard number="1–2 weeks" label="Avg. Issuance Time" />
          <StatCard number="100%" label="Digital Verification" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full py-14">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white text-center mb-10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Why This Certificate Stands Out
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<ShieldCheck className="w-6 h-6 text-emerald-300" />} title="Verified by Experts" desc="Project-based evaluation by expert instructors." />
            <FeatureCard icon={<Share2 className="w-6 h-6 text-indigo-300" />} title="Shareable Anywhere" desc="Add to LinkedIn, CV, or website with instant verification link." />
            <FeatureCard icon={<Sparkles className="w-6 h-6 text-pink-300" />} title="Project-Backed Proof" desc="Showcase actual work, not just a test score." />
            <FeatureCard icon={<BadgeCheck className="w-6 h-6 text-yellow-300" />} title="Industry Recognition" desc="Designed with input from hiring managers." />
            <FeatureCard icon={<Trophy className="w-6 h-6 text-orange-300" />} title="Boosts Credibility" desc="Enhances your professional profile instantly." />
            <FeatureCard icon={<Clock className="w-6 h-6 text-cyan-300" />} title="Lifetime Validity" desc="Credential remains valid and accessible for life." />
          </div>
        </div>
      </section>

      {/* Steps How to Earn */}
      <section className="w-full py-14">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h3
            className="text-2xl md:text-3xl font-semibold text-white text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            How You Earn It
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard step="01" title="Learn & Practice" desc="Complete live training and practise on guided labs." />
            <StepCard step="02" title="Build Projects" desc="Submit work reviewed by instructors." />
            <StepCard step="03" title="Get Certified" desc="Receive your verifiable certificate with a share link." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-xl">
            <h4 className="text-2xl md:text-3xl font-bold text-white mb-3">Start Your Certification Journey Today</h4>
            <p className="text-gray-200 mb-6">Join our Live Training Program or explore courses to earn the Zyntiq Value Added Certificate.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/live-training" className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium">Join Live Training</Link>
              <Link to="/courses" className="px-6 py-3 rounded-lg border border-white/40 hover:border-white/60 text-white font-medium">Browse Courses</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="w-full pb-16">
        <div className="max-w-4xl mx-auto px-4 grid gap-4">
          <FaqItem q="Is the certificate verifiable online?" a="Yes. Each certificate has a secure verification link for recruiters." />
          <FaqItem q="Do I need to renew it?" a="No. Your credential remains valid and accessible for life." />
          <FaqItem q="Can I add it to LinkedIn?" a="Yes! You'll receive a shareable URL and instructions for LinkedIn." />
        </div>
      </section>
    </main>
  );
}

// Reusable subcomponents
function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center">
      <p className="text-2xl font-bold text-white">{number}</p>
      <p className="text-gray-300 text-sm">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactElement; title: string; desc: string }) {
  return (
    <motion.div
      className="rounded-xl p-5 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
          {icon}
        </div>
        <h4 className="text-white font-semibold">{title}</h4>
      </div>
      <p className="text-gray-200 text-sm">{desc}</p>
    </motion.div>
  );
}

function StepCard({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <motion.div
      className="rounded-xl p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/80 text-sm">Step</span>
        <span className="text-white/80 text-sm">{step}</span>
      </div>
      <h5 className="text-white font-semibold mb-2">{title}</h5>
      <p className="text-gray-200 text-sm">{desc}</p>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl p-5 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
      <p className="text-white font-medium mb-1">{q}</p>
      <p className="text-gray-200 text-sm">{a}</p>
    </div>
  );
}
