'use client';

import { useGameStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Clock, Coins, Star, Lightbulb, ArrowRight, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function PlanPhase() {
  const { startBuilding, resetGame, credits, timeRemaining, progress } = useGameStore();
  const scenario = useGameStore((s) => s.getCurrentScenario());
  const [showHint, setShowHint] = useState(false);

  if (!scenario) return null;

  const minutes = Math.floor(timeRemaining / 60);

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
      <div className="flex flex-col items-center px-4 py-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={resetGame}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              ← Back to Menu
            </button>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              {Array.from({ length: scenario.difficulty }).map((_, i) => (
                <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
            {/* Title Bar + Resources row */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-slate-700 px-5 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-medium mb-0.5">
                    <span>📋</span> REQUEST ANALYSIS
                  </div>
                  <h2 className="text-xl font-bold text-slate-100">{scenario.title}</h2>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Coins size={14} className="text-yellow-400" />
                    <span className="font-bold text-slate-100">{credits}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-blue-400" />
                    <span className="font-bold text-slate-100">{minutes}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-purple-400" />
                    <span className="font-bold text-slate-100">{progress.reputation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Briefing */}
            <div className="px-5 py-3 border-b border-slate-700/50">
              <p className="text-slate-300 text-sm leading-relaxed">&ldquo;{scenario.briefing}&rdquo;</p>
            </div>

            {/* Requirements + Stakeholders side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-700/50">
              {/* Requirements */}
              <div className="px-5 py-3 md:border-r border-b md:border-b-0 border-slate-700/50">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Key Requirements
                </h3>
                <div className="space-y-1.5">
                  {scenario.requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-900/50 rounded-lg px-3 py-2">
                      <span className="text-base">{req.icon}</span>
                      <div>
                        <div className="text-xs font-medium text-slate-200">{req.label}</div>
                        <div className="text-[10px] text-slate-500">{req.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stakeholders */}
              <div className="px-5 py-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Stakeholders
                </h3>
                <div className="space-y-1.5">
                  {scenario.stakeholders.map((sh) => (
                    <div key={sh.id} className="flex items-center gap-2 bg-slate-900/50 rounded-lg px-3 py-2">
                      <span className="text-base">{sh.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-200">{sh.name}</div>
                        <div className="text-[10px] text-slate-500">Want: {sh.want}</div>
                      </div>
                      <div className="text-[10px] font-mono text-cyan-400">{Math.round(sh.weight * 100)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hint */}
            <div className="px-5 py-3">
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="flex items-center gap-2 text-xs text-amber-400/70 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <Lightbulb size={12} />
                  Show Recommended Approach
                  <ChevronRight size={12} />
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2"
                >
                  <Lightbulb size={14} className="text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-200">{scenario.hint}</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Start Button */}
          <motion.button
            onClick={startBuilding}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-3 text-lg shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            Start Building
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
