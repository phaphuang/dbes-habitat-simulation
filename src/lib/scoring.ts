import { PlacedHabitat, PlacedAgent, Connection, Scenario, ScoreBreakdown } from './types';
import { HABITATS, AGENTS, SYNERGIES } from './gameData';

export function calculateScore(
  habitats: PlacedHabitat[],
  agents: PlacedAgent[],
  connections: Connection[],
  scenario: Scenario
): ScoreBreakdown {
  const feedback: ScoreBreakdown['feedback'] = [];
  const conceptsApplied: ScoreBreakdown['conceptsApplied'] = [];
  const agentTypes = agents.map((a) => a.type);
  const agentCount = agents.length;

  // ============================================================
  // COMPONENT SCORES (each 0-100, weighted into final score)
  // ============================================================

  // --- 1. Agent Quality (25% of final) ---
  // Average efficiency+reliability of placed agents, scaled to 0-100
  let agentQuality = 0;
  if (agentCount > 0) {
    let totalEff = 0;
    let totalRel = 0;
    agents.forEach((a) => {
      const def = AGENTS[a.type];
      if (def) { totalEff += def.efficiency; totalRel += def.reliability; }
    });
    agentQuality = (totalEff + totalRel) / (agentCount * 2);
  }

  // --- 2. Habitat Placement (20% of final) ---
  // What % of agents are in their best habitat?
  let correctPlacements = 0;
  let wrongPlacements = 0;
  agents.forEach((agent) => {
    const agentDef = AGENTS[agent.type];
    const habitat = habitats.find((h) => h.id === agent.habitatId);
    if (agentDef && habitat) {
      if (agentDef.bestHabitat === habitat.type || agentDef.bestHabitat === 'any') {
        correctPlacements++;
      } else {
        wrongPlacements++;
      }
    }
  });
  const habitatMatchScore = agentCount > 0
    ? ((correctPlacements / agentCount) * 100) - (wrongPlacements / agentCount) * 30
    : 0;
  const habitatMatchBonus = Math.round(Math.max(0, (correctPlacements / Math.max(agentCount, 1)) * 15));
  const wrongHabitatPenalty = Math.round((wrongPlacements / Math.max(agentCount, 1)) * 15);

  if (wrongPlacements > 0) {
    feedback.push({ type: 'warning', message: `${wrongPlacements} agent(s) in wrong habitat (-${wrongHabitatPenalty}%)` });
  }
  if (correctPlacements > 0 && wrongPlacements === 0) {
    feedback.push({ type: 'success', message: `All agents in correct habitats (+${habitatMatchBonus}%)` });
  }

  // --- 3. Synergies (15% of final) ---
  let synergyCount = 0;
  const activeSynergies: string[] = [];
  SYNERGIES.forEach((synergy) => {
    if (agentTypes.includes(synergy.agents[0]) && agentTypes.includes(synergy.agents[1])) {
      synergyCount++;
      activeSynergies.push(synergy.bonusLabel);
      feedback.push({ type: 'success', message: synergy.bonusLabel });
    }
  });
  const possibleSynergies = SYNERGIES.length;
  const synergyScore = possibleSynergies > 0 ? (synergyCount / Math.min(possibleSynergies, 4)) * 100 : 0;
  const synergyBonus = Math.round(Math.min(synergyCount * 5, 15));

  // --- 4. Connections (15% of final) ---
  const connectionBonus = Math.min(connections.length * 5, 15);
  let connectionScore = 0;
  let disconnectedPenalty = 0;

  if (habitats.length >= 2) {
    const connectedIds = new Set<string>();
    connections.forEach((c) => { connectedIds.add(c.from); connectedIds.add(c.to); });
    const connectedCount = habitats.filter((h) => connectedIds.has(h.id)).length;
    const disconnectedHabitats = habitats.filter((h) => !connectedIds.has(h.id));
    disconnectedPenalty = disconnectedHabitats.length * 10;
    connectionScore = (connectedCount / habitats.length) * 100;

    if (disconnectedHabitats.length > 0) {
      const names = disconnectedHabitats.map((h) => HABITATS[h.type]?.name).join(', ');
      feedback.push({ type: 'warning', message: `Not connected: ${names} (-${disconnectedPenalty}%)` });
    } else {
      feedback.push({ type: 'success', message: `All habitats connected! (+${connectionBonus}%)` });
    }
  } else if (habitats.length === 1) {
    connectionScore = 100; // single habitat doesn't need connections
  }

  if (connections.length > 0) {
    feedback.push({ type: 'success', message: `${connections.length} connection(s) active (+${connectionBonus}%)` });
  }

  // --- 5. Requirements Fulfillment (25% of final) ---
  let requirementsMet = 0;
  let requirementsTotal = 0;
  let missingCriticalPenalty = 0;

  // Critical agents
  if (scenario.criticalAgents) {
    requirementsTotal += scenario.criticalAgents.length;
    scenario.criticalAgents.forEach((criticalType) => {
      if (agentTypes.includes(criticalType)) {
        requirementsMet++;
      } else {
        missingCriticalPenalty += 15;
        const agentDef = AGENTS[criticalType];
        feedback.push({ type: 'warning', message: `Missing critical agent: ${agentDef?.name || criticalType}` });
      }
    });
  }

  // Required habitat types
  if (scenario.requiredHabitatTypes) {
    requirementsTotal += scenario.requiredHabitatTypes.length;
    const placedTypes = new Set(habitats.map((h) => h.type));
    scenario.requiredHabitatTypes.forEach((reqType) => {
      if (placedTypes.has(reqType)) {
        requirementsMet++;
      } else {
        missingCriticalPenalty += 10;
        feedback.push({ type: 'warning', message: `Missing required habitat: ${HABITATS[reqType]?.name}` });
      }
    });
  }

  const requirementsScore = requirementsTotal > 0
    ? (requirementsMet / requirementsTotal) * 100
    : 100;

  // Over capacity penalty
  let overCapacityPenalty = 0;
  habitats.forEach((habitat) => {
    const def = HABITATS[habitat.type];
    const capacity = def.capacity + (habitat.level - 1);
    if (habitat.agents.length > capacity) {
      overCapacityPenalty += 15;
      feedback.push({ type: 'warning', message: `${def.name} is over capacity! (${habitat.agents.length}/${capacity})` });
    }
  });

  // ============================================================
  // WEIGHTED FINAL SCORE
  // ============================================================
  const weightedRaw =
    agentQuality * 0.25 +
    Math.max(0, habitatMatchScore) * 0.20 +
    Math.min(synergyScore, 100) * 0.15 +
    connectionScore * 0.15 +
    requirementsScore * 0.25;

  // Apply penalties as direct subtractions from the weighted score
  const totalPenalties = wrongHabitatPenalty + overCapacityPenalty + disconnectedPenalty + missingCriticalPenalty;
  const rawScore = weightedRaw - totalPenalties;

  // Clamp to 0-100
  const clampedScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  // ============================================================
  // STAKEHOLDER SCORES
  // ============================================================
  const stakeholderScores: Record<string, number> = {};
  let weightedTotal = 0;

  scenario.stakeholders.forEach((stakeholder) => {
    let score = clampedScore;

    // Small adjustments based on stakeholder's primary metric (+/- 5-8 max)
    switch (stakeholder.primaryMetric) {
      case 'speed':
        if (activeSynergies.some((s) => s.includes('Speed'))) score += 5;
        break;
      case 'trust':
        if (habitats.some((h) => h.type === 'trust')) score += 5;
        if (activeSynergies.some((s) => s.includes('Trust') || s.includes('Security'))) score += 3;
        break;
      case 'cost': {
        const totalSpent = agents.reduce((sum, a) => sum + (AGENTS[a.type]?.cost || 0), 0)
          + habitats.reduce((sum, h) => sum + (HABITATS[h.type]?.cost || 0), 0);
        const budgetRatio = totalSpent / scenario.credits;
        if (budgetRatio < 0.7) score += 5;
        else if (budgetRatio > 0.95) score -= 3;
        break;
      }
      case 'efficiency':
        if (correctPlacements === agentCount && agentCount > 0) score += 5;
        if (activeSynergies.some((s) => s.includes('Efficiency'))) score += 3;
        break;
      case 'userSatisfaction':
        if (habitats.some((h) => h.type === 'marketplace')) score += 4;
        if (agentTypes.includes('reviewSystem')) score += 2;
        if (agentTypes.includes('recommendationAI')) score += 2;
        break;
      case 'value':
        if (connections.length >= 2) score += 3;
        if (synergyCount >= 2) score += 3;
        break;
    }

    // Small habitat-type bonus
    habitats.forEach((h) => {
      const def = HABITATS[h.type];
      if (def.bonusType === stakeholder.primaryMetric) {
        score += 2;
      }
    });

    score = Math.max(0, Math.min(100, score));
    stakeholderScores[stakeholder.id] = Math.round(score);
    weightedTotal += score * stakeholder.weight;
  });

  const overallScore = Math.round(Math.max(0, Math.min(100, weightedTotal)));
  const passed = overallScore >= 70;
  const stars = overallScore >= 90 ? 3 : overallScore >= 80 ? 2 : overallScore >= 70 ? 1 : 0;

  // Add success feedback
  if (passed) {
    feedback.unshift({ type: 'success', message: `Ecosystem passed with ${overallScore}% overall score!` });
  }

  // Add lecture references as concepts applied
  scenario.lectureReferences.forEach((ref) => {
    conceptsApplied.push(ref);
  });

  return {
    baseScore: Math.round(agentQuality),
    habitatMatchBonus,
    synergyBonus,
    connectionBonus,
    wrongHabitatPenalty,
    overCapacityPenalty,
    missingCriticalPenalty,
    disconnectedPenalty,
    stakeholderScores,
    overallScore,
    passed,
    stars,
    feedback,
    conceptsApplied,
  };
}

export function getActiveSynergies(agents: PlacedAgent[]): string[] {
  const agentTypes = agents.map((a) => a.type);
  const active: string[] = [];

  SYNERGIES.forEach((synergy) => {
    if (agentTypes.includes(synergy.agents[0]) && agentTypes.includes(synergy.agents[1])) {
      active.push(synergy.bonusLabel);
    }
  });

  return active;
}

export function isAgentGoodFit(agentType: string, habitatType: string): 'good' | 'neutral' | 'poor' {
  const agentDef = AGENTS[agentType];
  if (!agentDef) return 'neutral';
  if (agentDef.bestHabitat === 'any') return 'good';
  if (agentDef.bestHabitat === habitatType) return 'good';
  return 'poor';
}
