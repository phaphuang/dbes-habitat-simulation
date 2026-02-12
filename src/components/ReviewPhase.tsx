'use client';

import { useGameStore } from '@/lib/store';
import { SCENARIOS } from '@/lib/gameData';
import { motion } from 'framer-motion';
import {
  Star, CheckCircle, AlertTriangle, BookOpen, ArrowRight,
  RotateCcw, Download, Trophy, TrendingUp, TrendingDown, Minus
} from 'lucide-react';

function StarRating({ stars, delay = 0 }: { stars: number; delay?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={i < stars ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 0.2 }}
          transition={{ delay: delay + i * 0.2, duration: 0.4 }}
        >
          <Star
            size={32}
            className={i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-slate-700'}
          />
        </motion.div>
      ))}
    </div>
  );
}

function ProgressBar({ value, color, delay = 0 }: { value: number; color: string; delay?: number }) {
  return (
    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ delay, duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export default function ReviewPhase() {
  const { scoreBreakdown, resetGame, startScenario, currentScenarioId } = useGameStore();
  const scenario = useGameStore((s) => s.getCurrentScenario());

  if (!scoreBreakdown || !scenario) return null;

  const { overallScore, passed, stars, stakeholderScores, feedback, conceptsApplied } = scoreBreakdown;

  // Find next scenario
  const currentIndex = SCENARIOS.findIndex((s) => s.id === currentScenarioId);
  const nextScenario = currentIndex < SCENARIOS.length - 1 ? SCENARIOS[currentIndex + 1] : null;

  const scoreColor = overallScore >= 80 ? '#22c55e' : overallScore >= 70 ? '#eab308' : '#ef4444';

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{ backgroundColor: scoreColor + '20', border: `2px solid ${scoreColor}40` }}
          >
            <span className="text-4xl font-bold" style={{ color: scoreColor }}>
              {overallScore}
            </span>
          </motion.div>

          <h2 className="text-2xl font-bold text-slate-100 mb-1">
            {passed ? 'Ecosystem Approved!' : 'Needs Improvement'}
          </h2>
          <p className="text-slate-400 text-sm">{scenario.title} — {scenario.subtitle}</p>

          <div className="flex justify-center mt-3">
            <StarRating stars={stars} delay={0.5} />
          </div>
        </div>

        {/* Score Breakdown Card */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden">
          {/* Stakeholder Satisfaction */}
          <div className="px-6 py-5 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Stakeholder Satisfaction
            </h3>
            <div className="space-y-3">
              {scenario.stakeholders.map((sh, i) => {
                const shScore = stakeholderScores[sh.id] || 0;
                const met = shScore >= sh.targetPercent;
                const exceeded = shScore >= sh.targetPercent + 10;
                const barColor = exceeded ? '#22c55e' : met ? '#3b82f6' : shScore >= sh.targetPercent * 0.8 ? '#eab308' : '#ef4444';

                return (
                  <div key={sh.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{sh.icon}</span>
                        <span className="text-sm text-slate-200">{sh.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-bold" style={{ color: barColor }}>
                          {shScore}%
                        </span>
                        {exceeded ? (
                          <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                            <TrendingUp size={10} /> Exceeded
                          </span>
                        ) : met ? (
                          <span className="flex items-center gap-0.5 text-[10px] text-blue-400">
                            <Minus size={10} /> Met
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-400">
                            <TrendingDown size={10} /> Below
                          </span>
                        )}
                      </div>
                    </div>
                    <ProgressBar value={shScore} color={barColor} delay={0.3 + i * 0.15} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Score Components */}
          <div className="px-6 py-5 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Score Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between bg-slate-900/50 rounded-lg px-3 py-2">
                <span className="text-slate-400">Base Score</span>
                <span className="font-mono text-slate-200">{scoreBreakdown.baseScore}%</span>
              </div>
              <div className="flex justify-between bg-emerald-500/5 rounded-lg px-3 py-2">
                <span className="text-emerald-400">Habitat Match</span>
                <span className="font-mono text-emerald-300">+{scoreBreakdown.habitatMatchBonus}%</span>
              </div>
              <div className="flex justify-between bg-cyan-500/5 rounded-lg px-3 py-2">
                <span className="text-cyan-400">Synergies</span>
                <span className="font-mono text-cyan-300">+{scoreBreakdown.synergyBonus}%</span>
              </div>
              <div className="flex justify-between bg-blue-500/5 rounded-lg px-3 py-2">
                <span className="text-blue-400">Connections</span>
                <span className="font-mono text-blue-300">+{scoreBreakdown.connectionBonus}%</span>
              </div>
              {scoreBreakdown.wrongHabitatPenalty > 0 && (
                <div className="flex justify-between bg-red-500/5 rounded-lg px-3 py-2">
                  <span className="text-red-400">Wrong Habitat</span>
                  <span className="font-mono text-red-300">-{scoreBreakdown.wrongHabitatPenalty}%</span>
                </div>
              )}
              {scoreBreakdown.overCapacityPenalty > 0 && (
                <div className="flex justify-between bg-red-500/5 rounded-lg px-3 py-2">
                  <span className="text-red-400">Over Capacity</span>
                  <span className="font-mono text-red-300">-{scoreBreakdown.overCapacityPenalty}%</span>
                </div>
              )}
              {scoreBreakdown.disconnectedPenalty > 0 && (
                <div className="flex justify-between bg-red-500/5 rounded-lg px-3 py-2">
                  <span className="text-red-400">Disconnected</span>
                  <span className="font-mono text-red-300">-{scoreBreakdown.disconnectedPenalty}%</span>
                </div>
              )}
              {scoreBreakdown.missingCriticalPenalty > 0 && (
                <div className="flex justify-between bg-red-500/5 rounded-lg px-3 py-2">
                  <span className="text-red-400">Missing Critical</span>
                  <span className="font-mono text-red-300">-{scoreBreakdown.missingCriticalPenalty}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Feedback */}
          <div className="px-6 py-5 border-b border-slate-700/50">
            <div className="grid md:grid-cols-2 gap-4">
              {/* What worked */}
              <div>
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  What Worked Well
                </h4>
                <div className="space-y-1.5">
                  {feedback.filter((f) => f.type === 'success').map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                      {f.message}
                    </div>
                  ))}
                  {feedback.filter((f) => f.type === 'success').length === 0 && (
                    <div className="text-xs text-slate-600">No notable successes</div>
                  )}
                </div>
              </div>

              {/* What could improve */}
              <div>
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                  What Could Improve
                </h4>
                <div className="space-y-1.5">
                  {feedback.filter((f) => f.type === 'warning').map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <AlertTriangle size={12} className="text-amber-400 mt-0.5 shrink-0" />
                      {f.message}
                    </div>
                  ))}
                  {feedback.filter((f) => f.type === 'warning').length === 0 && (
                    <div className="text-xs text-slate-600">No warnings — great job!</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Concepts Applied */}
          <div className="px-6 py-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen size={14} /> Concepts Applied
            </h3>
            <div className="space-y-2">
              {conceptsApplied.map((concept, i) => (
                <div key={i} className="flex items-start gap-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg px-4 py-2.5">
                  <span className="text-indigo-400 text-xs font-mono shrink-0">📚</span>
                  <div>
                    <div className="text-xs font-medium text-indigo-300">{concept.layer}</div>
                    <div className="text-xs text-slate-400">{concept.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="px-6 py-5 border-t border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Learning Objectives
            </h3>
            <div className="space-y-1.5">
              {scenario.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle size={12} className={passed ? 'text-emerald-400' : 'text-slate-600'} />
                  {obj}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {nextScenario && passed && (
            <motion.button
              onClick={() => startScenario(nextScenario.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Next Level <ArrowRight size={16} />
            </motion.button>
          )}
          <button
            onClick={() => currentScenarioId && startScenario(currentScenarioId)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw size={16} /> Replay
          </button>
          <button
            onClick={resetGame}
            className="bg-slate-800 hover:bg-slate-700 text-slate-400 font-medium py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            Menu
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-600 pb-4">
          CMU ICDI — Digital Business Ecosystem Course
        </div>
      </motion.div>
    </div>
  );
}
