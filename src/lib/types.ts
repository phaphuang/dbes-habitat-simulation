// ============================================================
// EcoArchitect: DBES Habitat Simulation - Core Types
// ============================================================

export type HabitatType = 'marketplace' | 'payment' | 'data' | 'trust' | 'innovation';

export interface HabitatDefinition {
  type: HabitatType;
  name: string;
  icon: string;
  cost: number;
  capacity: number;
  specialBonus: string;
  bonusType: string;
  bonusValue: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface PlacedHabitat {
  id: string;
  type: HabitatType;
  level: number;
  agents: string[]; // agent instance IDs
  x: number;
  y: number;
}

export interface AgentDefinition {
  type: string;
  name: string;
  icon: string;
  efficiency: number;
  reliability: number;
  cost: number;
  bestHabitat: HabitatType | 'any';
}

export interface PlacedAgent {
  id: string;
  type: string;
  habitatId: string;
}

export interface Connection {
  id: string;
  from: string; // habitat ID
  to: string;   // habitat ID
}

export interface Synergy {
  agents: [string, string]; // agent type pair
  bonusType: string;
  bonusLabel: string;
  bonusValue: number;
}

export interface StakeholderDefinition {
  id: string;
  name: string;
  icon: string;
  want: string;
  primaryMetric: string;
  targetPercent: number;
  weight: number;
}

export type ScenarioDifficulty = 1 | 2 | 3 | 4 | 5;

export interface ScenarioRequirement {
  label: string;
  icon: string;
  description: string;
}

export interface ScenarioGiven {
  habitats?: { type: HabitatType; agents: string[] }[];
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  difficulty: ScenarioDifficulty;
  timeMinutes: number;
  credits: number;
  description: string;
  briefing: string;
  requirements: ScenarioRequirement[];
  stakeholders: StakeholderDefinition[];
  hint: string;
  given?: ScenarioGiven;
  learningObjectives: string[];
  lectureReferences: { layer: string; description: string }[];
  criticalAgents?: string[]; // agent types that are critical for this scenario
  requiredHabitatTypes?: HabitatType[];
}

export type GamePhase = 'menu' | 'plan' | 'build' | 'review' | 'study' | 'howtoplay';

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  requirement: string;
  reward: string;
  unlocked: boolean;
}

export interface PlayerProgress {
  reputation: number;
  completedScenarios: string[];
  achievements: string[];
  totalCreditsEarned: number;
  bestScores: Record<string, number>;
}

export interface ScoreBreakdown {
  baseScore: number;
  habitatMatchBonus: number;
  synergyBonus: number;
  connectionBonus: number;
  wrongHabitatPenalty: number;
  overCapacityPenalty: number;
  missingCriticalPenalty: number;
  disconnectedPenalty: number;
  stakeholderScores: Record<string, number>;
  overallScore: number;
  passed: boolean;
  stars: number;
  feedback: { type: 'success' | 'warning'; message: string }[];
  conceptsApplied: { layer: string; description: string }[];
}
