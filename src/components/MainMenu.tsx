'use client';

import { useGameStore } from '@/lib/store';
import { SCENARIOS } from '@/lib/gameData';
import { ScenarioDifficulty } from '@/lib/types';
import { motion } from 'framer-motion';
import { Play, Lock, Star, Clock, Coins, Trophy, BookOpen, HelpCircle } from 'lucide-react';
import { useEffect } from 'react';

function DifficultyStars({ level }: { level: ScenarioDifficulty }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < level ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}
        />
      ))}
    </div>
  );
}

export default function MainMenu() {
  const { startScenario, progress, setPhase } = useGameStore();

  // Load progress from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ecoarchitect-progress');
        if (saved) {
          const parsed = JSON.parse(saved);
          useGameStore.setState({ progress: parsed });
        }
      } catch { /* ignore */ }
    }
  }, []);

  const isUnlocked = (scenarioId: string, index: number) => {
    if (index === 0) return true;
    const prevScenario = SCENARIOS[index - 1];
    return progress.completedScenarios.includes(prevScenario.id);
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
          EcoArchitect
        </h1>
        <p className="text-slate-400 text-lg">DBES Habitat Simulation — Balanced Edition</p>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Trophy size={14} className="text-yellow-500" />
            Reputation: {progress.reputation}
          </span>
          <span className="flex items-center gap-1">
            <Star size={14} className="text-emerald-500" />
            Completed: {progress.completedScenarios.length}/{SCENARIOS.length}
          </span>
        </div>
      </motion.div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full">
        {SCENARIOS.map((scenario, index) => {
          const unlocked = isUnlocked(scenario.id, index);
          const completed = progress.completedScenarios.includes(scenario.id);
          const bestScore = progress.bestScores[scenario.id];

          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <button
                onClick={() => unlocked && startScenario(scenario.id)}
                disabled={!unlocked}
                className={`w-full text-left rounded-xl border p-5 transition-all duration-200 ${
                  unlocked
                    ? 'border-slate-700 bg-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-800 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer'
                    : 'border-slate-800 bg-slate-900/50 opacity-50 cursor-not-allowed'
                } ${completed ? 'ring-1 ring-emerald-500/30' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Scenario {index + 1} — {scenario.subtitle}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-100">{scenario.title}</h3>
                  </div>
                  {!unlocked && <Lock size={18} className="text-slate-600 mt-1" />}
                  {completed && (
                    <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded-full">
                      <Star size={12} className="fill-emerald-400" />
                      {bestScore}%
                    </div>
                  )}
                </div>

                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{scenario.description}</p>

                <div className="flex items-center justify-between">
                  <DifficultyStars level={scenario.difficulty} />
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {scenario.timeMinutes}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Coins size={12} /> {scenario.credits}
                    </span>
                  </div>
                </div>

                {unlocked && !completed && (
                  <div className="mt-4 flex items-center justify-center gap-2 bg-cyan-500/10 text-cyan-400 rounded-lg py-2 text-sm font-medium">
                    <Play size={14} /> Start Mission
                  </div>
                )}
                {unlocked && completed && (
                  <div className="mt-4 flex items-center justify-center gap-2 bg-slate-700/50 text-slate-400 rounded-lg py-2 text-sm font-medium">
                    <Play size={14} /> Replay
                  </div>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex items-center gap-3"
      >
        <button
          onClick={() => setPhase('howtoplay')}
          className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 rounded-xl px-5 py-3 text-sm font-medium transition-all cursor-pointer"
        >
          <HelpCircle size={16} className="text-cyan-400" /> How to Play
        </button>
        <button
          onClick={() => setPhase('study')}
          className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 rounded-xl px-5 py-3 text-sm font-medium transition-all cursor-pointer"
        >
          <BookOpen size={16} className="text-indigo-400" /> Study Mode
        </button>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-4 text-center text-xs text-slate-600"
      >
        CMU ICDI — Digital Business Ecosystem Course • EcoArchitect v3.0
      </motion.div>
    </div>
  );
}
