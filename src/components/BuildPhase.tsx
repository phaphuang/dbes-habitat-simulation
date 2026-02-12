'use client';

import { useGameStore } from '@/lib/store';
import { HABITATS, AGENTS, CONNECTION_COST, UPGRADE_COSTS } from '@/lib/gameData';
import { HabitatType, PlacedHabitat } from '@/lib/types';
import { isAgentGoodFit, getActiveSynergies } from '@/lib/scoring';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Coins, Star, ArrowUpCircle, Link2, Trash2, AlertTriangle,
  CheckCircle, Zap, RotateCcw, FlaskConical, X
} from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ============================================================
// Habitat Palette Item (left panel)
// ============================================================
function HabitatPaletteItem({ type }: { type: HabitatType }) {
  const def = HABITATS[type];
  const credits = useGameStore((s) => s.credits);
  const canAfford = credits >= def.cost;

  return (
    <div
      draggable={canAfford}
      onDragStart={(e) => {
        e.dataTransfer.setData('habitat-type', type);
        e.dataTransfer.effectAllowed = 'copy';
      }}
      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all cursor-grab active:cursor-grabbing select-none ${
        canAfford
          ? 'border-slate-600 bg-slate-800 hover:border-slate-500 hover:bg-slate-750'
          : 'border-slate-800 bg-slate-900/50 opacity-40 cursor-not-allowed'
      }`}
    >
      <span className="text-2xl">{def.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-200">{def.name}</div>
        <div className="text-xs text-slate-500">{def.specialBonus}</div>
      </div>
      <div className="flex items-center gap-1 text-xs font-mono text-yellow-400">
        <Coins size={10} /> {def.cost}
      </div>
    </div>
  );
}

// ============================================================
// Agent Palette Item (right panel)
// ============================================================
function AgentPaletteItem({ type }: { type: string }) {
  const def = AGENTS[type];
  const credits = useGameStore((s) => s.credits);
  const canAfford = credits >= def.cost;

  return (
    <div
      draggable={canAfford}
      onDragStart={(e) => {
        e.dataTransfer.setData('agent-type', type);
        e.dataTransfer.effectAllowed = 'copy';
      }}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-all cursor-grab active:cursor-grabbing select-none ${
        canAfford
          ? 'border-slate-600 bg-slate-800 hover:border-slate-500'
          : 'border-slate-800 bg-slate-900/50 opacity-40 cursor-not-allowed'
      }`}
    >
      <span className="text-lg">{def.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-slate-200 truncate">{def.name}</div>
        <div className="flex gap-2 text-[10px] text-slate-500">
          <span>Eff:{def.efficiency}</span>
          <span>Rel:{def.reliability}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs font-mono text-yellow-400 shrink-0">
        <Coins size={10} /> {def.cost}
      </div>
    </div>
  );
}

// ============================================================
// Placed Habitat on Board
// ============================================================
function HabitatNode({
  habitat,
  isConnecting,
  isConnectingSource,
  isConnected,
  totalHabitats,
}: {
  habitat: PlacedHabitat;
  isConnecting: boolean;
  isConnectingSource: boolean;
  isConnected: boolean;
  totalHabitats: number;
}) {
  const def = HABITATS[habitat.type];
  const agents = useGameStore((s) => s.agents.filter((a) => a.habitatId === habitat.id));
  const {
    placeAgent, removeAgent, removeHabitat, upgradeHabitat,
    startConnection, completeConnection,
  } = useGameStore();
  const capacity = def.capacity + (habitat.level - 1);
  const isFull = agents.length >= capacity;
  const [showActions, setShowActions] = useState(false);
  const showUnconnectedWarning = !isConnected && totalHabitats >= 2;

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('agent-type')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const agentType = e.dataTransfer.getData('agent-type');
    if (agentType) {
      placeAgent(agentType, habitat.id);
    }
  };

  const handleClick = () => {
    if (isConnecting && !isConnectingSource) {
      completeConnection(habitat.id);
    } else {
      setShowActions(!showActions);
    }
  };

  return (
    <div
      className="absolute group"
      style={{ left: habitat.x, top: habitat.y, transform: 'translate(-50%, -50%)' }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative rounded-xl border-2 p-3 min-w-[140px] transition-all cursor-pointer select-none ${
          isConnecting && !isConnectingSource
            ? 'border-cyan-400 bg-cyan-500/10 ring-2 ring-cyan-400/30'
            : isConnectingSource
            ? 'border-yellow-400 bg-yellow-500/10'
            : 'hover:shadow-lg'
        }`}
        style={{
          borderColor: isConnecting ? undefined : def.color + '80',
          backgroundColor: def.bgColor + '15',
        }}
      >
        {/* Level badge */}
        {habitat.level > 1 && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            L{habitat.level}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{def.icon}</span>
          <div>
            <div className="text-sm font-semibold text-slate-100">{def.name}</div>
            <div className="text-[10px] text-slate-500">
              {agents.length}/{capacity} agents
            </div>
          </div>
        </div>

        {/* Agents in habitat */}
        <div className="flex flex-wrap gap-1 min-h-[24px]">
          {agents.map((agent) => {
            const agentDef = AGENTS[agent.type];
            const fit = isAgentGoodFit(agent.type, habitat.type);
            return (
              <div
                key={agent.id}
                className={`relative group/agent text-sm rounded px-1.5 py-0.5 border cursor-pointer transition-all ${
                  fit === 'good'
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : fit === 'poor'
                    ? 'border-red-500/40 bg-red-500/10'
                    : 'border-slate-600 bg-slate-700/50'
                }`}
                title={`${agentDef?.name} (${fit === 'good' ? 'Good fit' : fit === 'poor' ? 'Poor fit' : 'Neutral'})`}
              >
                <span>{agentDef?.icon}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAgent(agent.id);
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] opacity-0 group-hover/agent:opacity-100 transition-opacity cursor-pointer"
                >
                  ×
                </button>
              </div>
            );
          })}
          {!isFull && (
            <div className="text-xs text-slate-600 border border-dashed border-slate-700 rounded px-1.5 py-0.5">
              +
            </div>
          )}
        </div>

        {/* Capacity warning */}
        {isFull && (
          <div className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
            <AlertTriangle size={10} /> Full
          </div>
        )}

        {/* Unconnected warning */}
        {showUnconnectedWarning && !isConnecting && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              startConnection(habitat.id);
            }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] bg-red-500/20 border border-red-500/40 text-red-400 rounded-full px-2 py-0.5 whitespace-nowrap hover:bg-red-500/30 transition-colors cursor-pointer z-10"
          >
            <Link2 size={9} /> Not connected!
          </button>
        )}
      </motion.div>

      {/* Action buttons */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 flex gap-1 bg-slate-900 border border-slate-700 rounded-lg p-1.5 shadow-xl z-20"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                startConnection(habitat.id);
                setShowActions(false);
              }}
              className="flex items-center gap-1 text-xs bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 rounded px-2 py-1.5 transition-colors cursor-pointer"
              title={`Connect (${CONNECTION_COST} credits)`}
            >
              <Link2 size={12} /> Connect
            </button>
            {habitat.level < 3 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  upgradeHabitat(habitat.id);
                  setShowActions(false);
                }}
                className="flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 rounded px-2 py-1.5 transition-colors cursor-pointer"
                title={`Upgrade to L${habitat.level + 1} (${UPGRADE_COSTS[(habitat.level + 1) as 2 | 3]} credits)`}
              >
                <ArrowUpCircle size={12} /> L{habitat.level + 1}
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeHabitat(habitat.id);
                setShowActions(false);
              }}
              className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded px-2 py-1.5 transition-colors cursor-pointer"
            >
              <Trash2 size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(false);
              }}
              className="flex items-center text-xs text-slate-500 hover:text-slate-300 rounded px-1 py-1.5 transition-colors cursor-pointer"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// Connection Lines SVG
// ============================================================
function ConnectionLines() {
  const habitats = useGameStore((s) => s.habitats);
  const connections = useGameStore((s) => s.connections);
  const removeConnection = useGameStore((s) => s.removeConnection);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      {connections.map((conn) => {
        const from = habitats.find((h) => h.id === conn.from);
        const to = habitats.find((h) => h.id === conn.to);
        if (!from || !to) return null;

        return (
          <g key={conn.id} className="pointer-events-auto cursor-pointer" onClick={() => removeConnection(conn.id)}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#06b6d4"
              strokeWidth={3}
              strokeDasharray="8 4"
              className="connection-glow"
              opacity={0.6}
            />
            {/* Migration dot */}
            <circle r={4} fill="#06b6d4" opacity={0.8}>
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path={`M${from.x},${from.y} L${to.x},${to.y}`}
              />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// Live Metrics Panel
// ============================================================
function LiveMetrics() {
  const getLiveScore = useGameStore((s) => s.getLiveScore);
  const scenario = useGameStore((s) => s.getCurrentScenario());
  const agents = useGameStore((s) => s.agents);
  const [score, setScore] = useState(getLiveScore());

  useEffect(() => {
    const interval = setInterval(() => {
      setScore(getLiveScore());
    }, 500);
    return () => clearInterval(interval);
  }, [getLiveScore]);

  const activeSynergies = getActiveSynergies(agents);

  if (!score || !scenario) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-slate-700 rounded-xl p-4 backdrop-blur-sm z-10">
      <div className="flex items-start gap-6">
        {/* Overall Score */}
        <div className="shrink-0">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Ecosystem Health</div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${score.overallScore}%`,
                  backgroundColor: score.overallScore >= 85 ? '#22c55e' : score.overallScore >= 70 ? '#eab308' : '#ef4444',
                }}
              />
            </div>
            <span className="text-sm font-bold text-slate-200">{score.overallScore}%</span>
          </div>
        </div>

        {/* Stakeholder Preview */}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Stakeholders</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {scenario.stakeholders.map((sh) => {
              const shScore = score.stakeholderScores[sh.id] || 0;
              return (
                <div key={sh.id} className="flex items-center gap-1.5 text-xs">
                  <span>{sh.icon}</span>
                  <span className="text-slate-400">{sh.name}:</span>
                  <span className={`font-mono font-medium ${
                    shScore >= sh.targetPercent ? 'text-emerald-400' : shScore >= sh.targetPercent * 0.8 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {shScore}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Synergies */}
        <div className="shrink-0">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Synergies</div>
          {activeSynergies.length > 0 ? (
            <div className="space-y-0.5">
              {activeSynergies.map((s, i) => (
                <div key={i} className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <CheckCircle size={10} /> {s}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[10px] text-slate-600">No active synergies</div>
          )}
        </div>
      </div>

      {/* Warnings */}
      {score.feedback.filter((f) => f.type === 'warning').length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-800">
          {score.feedback.filter((f) => f.type === 'warning').map((f, i) => (
            <div key={i} className="flex items-center gap-1 text-[10px] text-amber-400">
              <AlertTriangle size={10} /> {f.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Main Build Phase Component
// ============================================================
export default function BuildPhase() {
  const {
    credits, timeRemaining, progress, habitats, connections,
    connectingFrom, cancelConnection, testSolution, resetGame, tick,
    placeHabitat,
  } = useGameStore();
  const scenario = useGameStore((s) => s.getCurrentScenario());
  const boardRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  // Handle board drop for habitats
  const handleBoardDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const habitatType = e.dataTransfer.getData('habitat-type') as HabitatType;
    if (habitatType && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      placeHabitat(habitatType, x, y);
    }
  }, [placeHabitat]);

  const handleBoardDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('habitat-type')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  }, []);

  if (!scenario) return null;

  const timeWarning = timeRemaining < 60;
  const habitatTypes = Object.keys(HABITATS) as HabitatType[];
  const agentTypes = Object.keys(AGENTS);

  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-cyan-400 tracking-wide">ECOARCHITECT</h1>
          <span className="text-xs text-slate-500">|</span>
          <span className="text-sm text-slate-300">{scenario.title}</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-sm">
            <Coins size={14} className="text-yellow-400" />
            <span className="font-mono font-bold text-slate-100">{credits}</span>
          </div>
          <div className={`flex items-center gap-1.5 text-sm ${timeWarning ? 'text-red-400' : ''}`}>
            <Clock size={14} className={timeWarning ? 'text-red-400' : 'text-blue-400'} />
            <span className="font-mono font-bold text-slate-100">{formatTime(timeRemaining)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Star size={14} className="text-purple-400" />
            <span className="font-mono font-bold text-slate-100">{progress.reputation}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left Panel: Habitats */}
        <div className="w-52 border-r border-slate-700 bg-slate-800/50 flex flex-col shrink-0">
          <div className="px-3 py-2 border-b border-slate-700">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Habitats</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {habitatTypes.map((type) => (
              <HabitatPaletteItem key={type} type={type} />
            ))}
          </div>
          <div className="px-3 py-2 border-t border-slate-700 text-[10px] text-slate-600">
            Drag habitats to the board
          </div>
        </div>

        {/* Center: Building Board */}
        <div className="flex-1 relative min-w-0">
          {/* Connecting mode banner */}
          <AnimatePresence>
            {connectingFrom && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm"
              >
                <Link2 size={14} />
                Click another habitat to connect ({CONNECTION_COST} credits)
                <button onClick={cancelConnection} className="ml-2 text-cyan-400 hover:text-white cursor-pointer">
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            ref={boardRef}
            onDrop={handleBoardDrop}
            onDragOver={handleBoardDragOver}
            onClick={() => connectingFrom && cancelConnection()}
            className="w-full h-full relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          >
            <ConnectionLines />
            {habitats.map((habitat) => {
              const isHabitatConnected = connections.some(
                (c) => c.from === habitat.id || c.to === habitat.id
              );
              return (
                <HabitatNode
                  key={habitat.id}
                  habitat={habitat}
                  isConnecting={!!connectingFrom}
                  isConnectingSource={connectingFrom === habitat.id}
                  isConnected={isHabitatConnected}
                  totalHabitats={habitats.length}
                />
              );
            })}

            {/* Empty state */}
            {habitats.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-slate-600">
                  <div className="text-4xl mb-2">🏗️</div>
                  <div className="text-sm">Drag habitats here to start building</div>
                </div>
              </div>
            )}
          </div>

          {/* Live Metrics */}
          <LiveMetrics />
        </div>

        {/* Right Panel: Agents */}
        <div className="w-52 border-l border-slate-700 bg-slate-800/50 flex flex-col shrink-0">
          <div className="px-3 py-2 border-b border-slate-700">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Agents</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {agentTypes.map((type) => (
              <AgentPaletteItem key={type} type={type} />
            ))}
          </div>
          <div className="px-3 py-2 border-t border-slate-700 text-[10px] text-slate-600">
            Drag agents into habitats
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-t border-slate-700 shrink-0">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-slate-500 truncate">
            📋 {scenario.briefing.substring(0, 100)}...
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <button
            onClick={resetGame}
            className="flex items-center gap-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg px-3 py-2 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} /> Reset
          </button>
          <button
            onClick={testSolution}
            className="flex items-center gap-1.5 text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold rounded-lg px-5 py-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <FlaskConical size={14} /> Test Solution
          </button>
        </div>
      </div>
    </div>
  );
}
