import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  GamePhase,
  PlacedHabitat,
  PlacedAgent,
  Connection,
  Scenario,
  ScoreBreakdown,
  PlayerProgress,
  HabitatType,
} from './types';
import { HABITATS, AGENTS, SCENARIOS, CONNECTION_COST, UPGRADE_COSTS } from './gameData';
import { calculateScore } from './scoring';

interface GameState {
  // Navigation
  phase: GamePhase;
  currentScenarioId: string | null;

  // Resources
  credits: number;
  timeRemaining: number; // seconds
  timerActive: boolean;

  // Board state
  habitats: PlacedHabitat[];
  agents: PlacedAgent[];
  connections: Connection[];

  // Connecting mode
  connectingFrom: string | null;

  // Results
  scoreBreakdown: ScoreBreakdown | null;

  // Player progress (persisted)
  progress: PlayerProgress;

  // Actions
  setPhase: (phase: GamePhase) => void;
  startScenario: (scenarioId: string) => void;
  startBuilding: () => void;

  // Board actions
  placeHabitat: (type: HabitatType, x: number, y: number) => void;
  removeHabitat: (habitatId: string) => void;
  moveHabitat: (habitatId: string, x: number, y: number) => void;
  upgradeHabitat: (habitatId: string) => void;
  placeAgent: (agentType: string, habitatId: string) => void;
  removeAgent: (agentId: string) => void;
  startConnection: (habitatId: string) => void;
  completeConnection: (habitatId: string) => void;
  cancelConnection: () => void;
  removeConnection: (connectionId: string) => void;

  // Timer
  tick: () => void;
  setTimerActive: (active: boolean) => void;

  // Scoring
  testSolution: () => void;
  getLiveScore: () => ScoreBreakdown | null;

  // Progress
  resetGame: () => void;

  // Helpers
  getCurrentScenario: () => Scenario | null;
  getCreditsSpent: () => number;
}

const defaultProgress: PlayerProgress = {
  reputation: 50,
  completedScenarios: [],
  achievements: [],
  totalCreditsEarned: 0,
  bestScores: {},
};

function loadProgress(): PlayerProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const saved = localStorage.getItem('ecoarchitect-progress');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return defaultProgress;
}

function saveProgress(progress: PlayerProgress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ecoarchitect-progress', JSON.stringify(progress));
  } catch { /* ignore */ }
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'menu',
  currentScenarioId: null,
  credits: 0,
  timeRemaining: 0,
  timerActive: false,
  habitats: [],
  agents: [],
  connections: [],
  connectingFrom: null,
  scoreBreakdown: null,
  progress: defaultProgress,

  setPhase: (phase) => set({ phase }),

  startScenario: (scenarioId) => {
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    const habitats: PlacedHabitat[] = [];
    const agents: PlacedAgent[] = [];

    // Place given habitats and agents
    if (scenario.given?.habitats) {
      scenario.given.habitats.forEach((givenHabitat, idx) => {
        const habitatId = uuidv4();
        const placedAgents: string[] = [];

        givenHabitat.agents.forEach((agentType) => {
          const agentId = uuidv4();
          placedAgents.push(agentId);
          agents.push({ id: agentId, type: agentType, habitatId });
        });

        habitats.push({
          id: habitatId,
          type: givenHabitat.type,
          level: 1,
          agents: placedAgents,
          x: 200 + idx * 250,
          y: 200,
        });
      });
    }

    // Calculate credits already spent on given items
    let givenCost = 0;
    if (scenario.given?.habitats) {
      scenario.given.habitats.forEach((gh) => {
        givenCost += HABITATS[gh.type]?.cost || 0;
        gh.agents.forEach((at) => {
          givenCost += AGENTS[at]?.cost || 0;
        });
      });
    }

    set({
      phase: 'plan',
      currentScenarioId: scenarioId,
      credits: scenario.credits,
      timeRemaining: scenario.timeMinutes * 60,
      timerActive: false,
      habitats,
      agents,
      connections: [],
      connectingFrom: null,
      scoreBreakdown: null,
    });
  },

  startBuilding: () => {
    set({ phase: 'build', timerActive: true });
  },

  placeHabitat: (type, x, y) => {
    const state = get();
    const def = HABITATS[type];
    if (!def || state.credits < def.cost) return;

    const habitatId = uuidv4();
    set({
      habitats: [...state.habitats, { id: habitatId, type, level: 1, agents: [], x, y }],
      credits: state.credits - def.cost,
    });
  },

  removeHabitat: (habitatId) => {
    const state = get();
    const habitat = state.habitats.find((h) => h.id === habitatId);
    if (!habitat) return;

    const def = HABITATS[habitat.type];
    const agentsToRemove = state.agents.filter((a) => a.habitatId === habitatId);
    const agentRefund = agentsToRemove.reduce((sum, a) => sum + (AGENTS[a.type]?.cost || 0), 0);
    const upgradeCost = habitat.level >= 3 ? 80 : habitat.level >= 2 ? 30 : 0;

    set({
      habitats: state.habitats.filter((h) => h.id !== habitatId),
      agents: state.agents.filter((a) => a.habitatId !== habitatId),
      connections: state.connections.filter((c) => c.from !== habitatId && c.to !== habitatId),
      credits: state.credits + Math.floor((def.cost + agentRefund + upgradeCost) * 0.7),
    });
  },

  moveHabitat: (habitatId, x, y) => {
    set({
      habitats: get().habitats.map((h) =>
        h.id === habitatId ? { ...h, x, y } : h
      ),
    });
  },

  upgradeHabitat: (habitatId) => {
    const state = get();
    const habitat = state.habitats.find((h) => h.id === habitatId);
    if (!habitat || habitat.level >= 3) return;

    const nextLevel = (habitat.level + 1) as 2 | 3;
    const cost = UPGRADE_COSTS[nextLevel];
    if (state.credits < cost) return;

    set({
      habitats: state.habitats.map((h) =>
        h.id === habitatId ? { ...h, level: nextLevel } : h
      ),
      credits: state.credits - cost,
    });
  },

  placeAgent: (agentType, habitatId) => {
    const state = get();
    const agentDef = AGENTS[agentType];
    const habitat = state.habitats.find((h) => h.id === habitatId);
    if (!agentDef || !habitat || state.credits < agentDef.cost) return;

    // Check capacity
    const habitatDef = HABITATS[habitat.type];
    const capacity = habitatDef.capacity + (habitat.level - 1);
    if (habitat.agents.length >= capacity) return;

    const agentId = uuidv4();
    set({
      agents: [...state.agents, { id: agentId, type: agentType, habitatId }],
      habitats: state.habitats.map((h) =>
        h.id === habitatId ? { ...h, agents: [...h.agents, agentId] } : h
      ),
      credits: state.credits - agentDef.cost,
    });
  },

  removeAgent: (agentId) => {
    const state = get();
    const agent = state.agents.find((a) => a.id === agentId);
    if (!agent) return;

    const agentDef = AGENTS[agent.type];
    set({
      agents: state.agents.filter((a) => a.id !== agentId),
      habitats: state.habitats.map((h) =>
        h.id === agent.habitatId
          ? { ...h, agents: h.agents.filter((aid) => aid !== agentId) }
          : h
      ),
      credits: state.credits + Math.floor((agentDef?.cost || 0) * 0.7),
    });
  },

  startConnection: (habitatId) => {
    set({ connectingFrom: habitatId });
  },

  completeConnection: (habitatId) => {
    const state = get();
    if (!state.connectingFrom || state.connectingFrom === habitatId) {
      set({ connectingFrom: null });
      return;
    }

    // Check if connection already exists
    const exists = state.connections.some(
      (c) =>
        (c.from === state.connectingFrom && c.to === habitatId) ||
        (c.from === habitatId && c.to === state.connectingFrom)
    );

    if (exists || state.credits < CONNECTION_COST) {
      set({ connectingFrom: null });
      return;
    }

    set({
      connections: [
        ...state.connections,
        { id: uuidv4(), from: state.connectingFrom, to: habitatId },
      ],
      credits: state.credits - CONNECTION_COST,
      connectingFrom: null,
    });
  },

  cancelConnection: () => set({ connectingFrom: null }),

  removeConnection: (connectionId) => {
    const state = get();
    set({
      connections: state.connections.filter((c) => c.id !== connectionId),
      credits: state.credits + Math.floor(CONNECTION_COST * 0.7),
    });
  },

  tick: () => {
    const state = get();
    if (!state.timerActive || state.timeRemaining <= 0) return;

    const newTime = state.timeRemaining - 1;
    if (newTime <= 0) {
      // Auto-submit when time runs out
      set({ timeRemaining: 0, timerActive: false });
      get().testSolution();
      return;
    }
    set({ timeRemaining: newTime });
  },

  setTimerActive: (active) => set({ timerActive: active }),

  testSolution: () => {
    const state = get();
    const scenario = get().getCurrentScenario();
    if (!scenario) return;

    const score = calculateScore(state.habitats, state.agents, state.connections, scenario);

    // Update progress
    const progress = { ...state.progress };
    if (score.passed && !progress.completedScenarios.includes(scenario.id)) {
      progress.completedScenarios.push(scenario.id);
      progress.reputation = Math.min(100, progress.reputation + 5);
    }
    const prevBest = progress.bestScores[scenario.id] || 0;
    if (score.overallScore > prevBest) {
      progress.bestScores[scenario.id] = score.overallScore;
    }
    saveProgress(progress);

    set({
      phase: 'review',
      timerActive: false,
      scoreBreakdown: score,
      progress,
    });
  },

  getLiveScore: () => {
    const state = get();
    const scenario = get().getCurrentScenario();
    if (!scenario) return null;
    return calculateScore(state.habitats, state.agents, state.connections, scenario);
  },

  resetGame: () => {
    set({
      phase: 'menu',
      currentScenarioId: null,
      credits: 0,
      timeRemaining: 0,
      timerActive: false,
      habitats: [],
      agents: [],
      connections: [],
      connectingFrom: null,
      scoreBreakdown: null,
    });
  },

  getCurrentScenario: () => {
    const state = get();
    return SCENARIOS.find((s) => s.id === state.currentScenarioId) || null;
  },

  getCreditsSpent: () => {
    const state = get();
    const scenario = get().getCurrentScenario();
    if (!scenario) return 0;
    return scenario.credits - state.credits;
  },
}));
