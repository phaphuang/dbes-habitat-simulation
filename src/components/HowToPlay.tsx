'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, MousePointer, Zap, FlaskConical, BookOpen, Link2, ArrowUpCircle } from 'lucide-react';

const STEPS = [
  {
    number: 1,
    title: 'READ the Request',
    description: 'Each scenario presents a real-world challenge. Read the briefing, check stakeholder needs, and understand the requirements.',
    icon: '📋',
    tip: 'Pay attention to stakeholder weights — some matter more than others!',
  },
  {
    number: 2,
    title: 'PLAN Your Approach',
    description: 'You have limited credits. Plan which habitats and agents you need before you start building.',
    icon: '🧠',
    tip: 'Use the hint button if you\'re stuck. No penalty for using it!',
  },
  {
    number: 3,
    title: 'BUILD Your Ecosystem',
    description: 'Drag habitats from the left panel onto the board. Then drag agents from the right panel into habitats.',
    icon: '🔨',
    tip: 'Green borders = good fit, Red = poor fit. Match agents to their best habitat!',
  },
  {
    number: 4,
    title: 'CONNECT Habitats',
    description: 'Click a habitat, then click "Connect" to link it to another. Connections cost 10 credits but enable migration and bonus efficiency.',
    icon: '🔗',
    tip: 'Each connection gives +5% efficiency. Connect related habitats!',
  },
  {
    number: 5,
    title: 'Look for SYNERGIES',
    description: 'Certain agent pairs create powerful bonuses when placed together. Watch the live metrics panel for active synergies.',
    icon: '⚡',
    tip: 'Payment Gateway + Currency Converter = +15% Speed. Fraud Detection + KYC = +20% Trust.',
  },
  {
    number: 6,
    title: 'TEST Your Solution',
    description: 'Click "Test Solution" when ready. You\'ll see detailed feedback on stakeholder satisfaction, score breakdown, and concepts applied.',
    icon: '🧪',
    tip: 'You need 70% overall satisfaction to pass. Aim for 80%+ for 2 stars, 90%+ for 3 stars!',
  },
];

export default function HowToPlay({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 sm:px-6 sm:py-4 border-b border-slate-700">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Menu
        </button>
        <h1 className="text-sm sm:text-lg font-bold text-slate-100">🎮 How to Play</h1>
        <div className="w-16 sm:w-24" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-8">
        <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2">
              Learn EcoArchitect in 60 Seconds
            </h2>
            <p className="text-slate-400">
              Design digital ecosystems by placing habitats, deploying agents, and balancing stakeholder needs.
            </p>
          </motion.div>

          {/* Steps */}
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 sm:p-5 flex gap-3 sm:gap-4"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-lg">
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-cyan-400">Step {step.number}</span>
                  <h3 className="text-sm font-semibold text-slate-100">{step.title}</h3>
                </div>
                <p className="text-sm text-slate-400 mb-2">{step.description}</p>
                <div className="flex items-start gap-1.5 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2">
                  <span className="text-amber-400 text-xs mt-0.5">💡</span>
                  <span className="text-xs text-amber-300">{step.tip}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Key Concepts Quick Reference */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 mt-6"
          >
            <h3 className="text-sm font-semibold text-slate-100 mb-3">Quick Reference</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="font-medium text-emerald-400 mb-1">🟢 Good Fit</div>
                <div className="text-slate-400">Agent matches habitat type → +10% bonus</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="font-medium text-red-400 mb-1">🔴 Poor Fit</div>
                <div className="text-slate-400">Agent in wrong habitat → -15% penalty</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="font-medium text-yellow-400 mb-1">⚡ Synergy</div>
                <div className="text-slate-400">Compatible agent pair → +10-20% bonus</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="font-medium text-cyan-400 mb-1">🔗 Connection</div>
                <div className="text-slate-400">Linked habitats → +5% efficiency each</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="font-medium text-purple-400 mb-1">⬆️ Upgrade</div>
                <div className="text-slate-400">Level up habitat → +1 agent capacity</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="font-medium text-amber-400 mb-1">⚠️ Over Capacity</div>
                <div className="text-slate-400">Too many agents → -20% penalty</div>
              </div>
            </div>
          </motion.div>

          {/* Scoring */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-800/80 border border-slate-700 rounded-xl p-5"
          >
            <h3 className="text-sm font-semibold text-slate-100 mb-3">Star Rating</h3>
            <div className="flex gap-4 sm:gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-slate-400">70%+</div>
                <div className="text-xs text-slate-600">Pass</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">⭐⭐</div>
                <div className="text-slate-400">80%+</div>
                <div className="text-xs text-slate-600">Good</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">⭐⭐⭐</div>
                <div className="text-slate-400">90%+</div>
                <div className="text-xs text-slate-600">Excellent</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
