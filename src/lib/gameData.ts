import { HabitatDefinition, AgentDefinition, Synergy, Scenario, Achievement } from './types';

// ============================================================
// HABITAT DEFINITIONS
// ============================================================
export const HABITATS: Record<string, HabitatDefinition> = {
  marketplace: {
    type: 'marketplace',
    name: 'Marketplace',
    icon: '🛒',
    cost: 40,
    capacity: 4,
    specialBonus: '+10% User Satisfaction',
    bonusType: 'userSatisfaction',
    bonusValue: 10,
    color: '#22c55e',
    bgColor: '#f0fdf4',
    borderColor: '#86efac',
  },
  payment: {
    type: 'payment',
    name: 'Payment',
    icon: '💰',
    cost: 50,
    capacity: 3,
    specialBonus: '+15% Transaction Speed',
    bonusType: 'transactionSpeed',
    bonusValue: 15,
    color: '#eab308',
    bgColor: '#fefce8',
    borderColor: '#fde047',
  },
  data: {
    type: 'data',
    name: 'Data',
    icon: '📊',
    cost: 35,
    capacity: 3,
    specialBonus: '+10% System Efficiency',
    bonusType: 'systemEfficiency',
    bonusValue: 10,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    borderColor: '#93c5fd',
  },
  trust: {
    type: 'trust',
    name: 'Trust',
    icon: '🔒',
    cost: 45,
    capacity: 3,
    specialBonus: '+20% Compliance Score',
    bonusType: 'compliance',
    bonusValue: 20,
    color: '#a855f7',
    bgColor: '#faf5ff',
    borderColor: '#c084fc',
  },
  innovation: {
    type: 'innovation',
    name: 'Innovation',
    icon: '💡',
    cost: 60,
    capacity: 5,
    specialBonus: 'Faster Evolution',
    bonusType: 'evolution',
    bonusValue: 15,
    color: '#f97316',
    bgColor: '#fff7ed',
    borderColor: '#fdba74',
  },
};

// ============================================================
// AGENT DEFINITIONS
// ============================================================
export const AGENTS: Record<string, AgentDefinition> = {
  paymentGateway: {
    type: 'paymentGateway',
    name: 'Payment Gateway',
    icon: '💳',
    efficiency: 85,
    reliability: 90,
    cost: 25,
    bestHabitat: 'payment',
  },
  currencyConverter: {
    type: 'currencyConverter',
    name: 'Currency Converter',
    icon: '💱',
    efficiency: 75,
    reliability: 80,
    cost: 20,
    bestHabitat: 'payment',
  },
  userAuth: {
    type: 'userAuth',
    name: 'User Auth',
    icon: '🔐',
    efficiency: 90,
    reliability: 95,
    cost: 15,
    bestHabitat: 'trust',
  },
  fraudDetection: {
    type: 'fraudDetection',
    name: 'Fraud Detection',
    icon: '🛡️',
    efficiency: 70,
    reliability: 85,
    cost: 30,
    bestHabitat: 'trust',
  },
  recommendationAI: {
    type: 'recommendationAI',
    name: 'Recommendation AI',
    icon: '🤖',
    efficiency: 80,
    reliability: 75,
    cost: 25,
    bestHabitat: 'data',
  },
  analyticsEngine: {
    type: 'analyticsEngine',
    name: 'Analytics Engine',
    icon: '📈',
    efficiency: 85,
    reliability: 80,
    cost: 20,
    bestHabitat: 'data',
  },
  reviewSystem: {
    type: 'reviewSystem',
    name: 'Review System',
    icon: '⭐',
    efficiency: 75,
    reliability: 85,
    cost: 15,
    bestHabitat: 'marketplace',
  },
  deliveryTracker: {
    type: 'deliveryTracker',
    name: 'Delivery Tracker',
    icon: '📦',
    efficiency: 80,
    reliability: 90,
    cost: 20,
    bestHabitat: 'marketplace',
  },
  prototypeLab: {
    type: 'prototypeLab',
    name: 'Prototype Lab',
    icon: '🧪',
    efficiency: 70,
    reliability: 70,
    cost: 35,
    bestHabitat: 'innovation',
  },
  abTesting: {
    type: 'abTesting',
    name: 'A/B Testing',
    icon: '🔬',
    efficiency: 75,
    reliability: 75,
    cost: 25,
    bestHabitat: 'innovation',
  },
  kycVerification: {
    type: 'kycVerification',
    name: 'KYC Verification',
    icon: '📋',
    efficiency: 85,
    reliability: 90,
    cost: 30,
    bestHabitat: 'trust',
  },
  apiConnector: {
    type: 'apiConnector',
    name: 'API Connector',
    icon: '🔗',
    efficiency: 80,
    reliability: 85,
    cost: 20,
    bestHabitat: 'any',
  },
};

// ============================================================
// SYNERGIES
// ============================================================
export const SYNERGIES: Synergy[] = [
  {
    agents: ['paymentGateway', 'currencyConverter'],
    bonusType: 'speed',
    bonusLabel: 'Payment + Currency = +15% Speed',
    bonusValue: 15,
  },
  {
    agents: ['fraudDetection', 'kycVerification'],
    bonusType: 'trust',
    bonusLabel: 'Fraud Detection + KYC = +20% Trust',
    bonusValue: 20,
  },
  {
    agents: ['analyticsEngine', 'recommendationAI'],
    bonusType: 'efficiency',
    bonusLabel: 'Analytics + Recommendation AI = +10% Efficiency',
    bonusValue: 10,
  },
  {
    agents: ['userAuth', 'fraudDetection'],
    bonusType: 'trust',
    bonusLabel: 'User Auth + Fraud Detection = +12% Security',
    bonusValue: 12,
  },
  {
    agents: ['reviewSystem', 'recommendationAI'],
    bonusType: 'userSatisfaction',
    bonusLabel: 'Reviews + AI = +10% User Satisfaction',
    bonusValue: 10,
  },
  {
    agents: ['prototypeLab', 'abTesting'],
    bonusType: 'evolution',
    bonusLabel: 'Prototype + A/B Testing = +15% Innovation',
    bonusValue: 15,
  },
  {
    agents: ['deliveryTracker', 'apiConnector'],
    bonusType: 'efficiency',
    bonusLabel: 'Delivery + API = +10% Logistics',
    bonusValue: 10,
  },
];

// ============================================================
// UPGRADE COSTS
// ============================================================
export const UPGRADE_COSTS = {
  2: 30,
  3: 50,
};

// ============================================================
// CONNECTION COST
// ============================================================
export const CONNECTION_COST = 10;

// ============================================================
// SCENARIOS
// ============================================================
export const SCENARIOS: Scenario[] = [
  {
    id: 'scenario-1',
    title: 'Digital Food Court',
    subtitle: 'Tutorial',
    difficulty: 1,
    timeMinutes: 10,
    credits: 100,
    description: 'Learn the basics of ecosystem design by building a simple digital food court.',
    briefing: 'A local food court wants to go digital. They need an online ordering system where customers can browse menus, place orders, and pay. Start with the provided Marketplace habitat and add a Payment system.',
    requirements: [
      { label: 'Ordering', icon: '🛒', description: 'Customers can browse and order food' },
      { label: 'Payment', icon: '💰', description: 'Accept digital payments' },
      { label: 'Reviews', icon: '⭐', description: 'Customers can rate their experience' },
    ],
    stakeholders: [
      { id: 'customers', name: 'Customers', icon: '👤', want: 'Easy ordering', primaryMetric: 'userSatisfaction', targetPercent: 70, weight: 0.40 },
      { id: 'vendors', name: 'Food Vendors', icon: '🏪', want: 'More orders', primaryMetric: 'efficiency', targetPercent: 65, weight: 0.35 },
      { id: 'management', name: 'Management', icon: '💼', want: 'Profit', primaryMetric: 'value', targetPercent: 60, weight: 0.25 },
    ],
    hint: 'Start with the given Marketplace, then add a Payment habitat and connect them. Place agents that match each habitat.',
    given: {
      habitats: [
        { type: 'marketplace', agents: ['reviewSystem', 'deliveryTracker'] },
      ],
    },
    learningObjectives: [
      'Understand what habitats are',
      'Learn to place agents in matching habitats',
      'Create connections between habitats',
    ],
    lectureReferences: [
      { layer: 'Layer 4 (Platform)', description: 'Digital ordering platform' },
      { layer: 'CONNECT Function', description: 'Linking marketplace to payment' },
    ],
    criticalAgents: ['paymentGateway'],
    requiredHabitatTypes: ['marketplace', 'payment'],
  },
  {
    id: 'scenario-2',
    title: 'GrabPay Expansion',
    subtitle: 'Resource Management',
    difficulty: 2,
    timeMinutes: 12,
    credits: 155,
    description: 'Expand a ride-hailing marketplace with payment capabilities under budget constraints.',
    briefing: 'GrabPay wants to expand their payment ecosystem. You have a working Marketplace but need to add robust payment processing, fraud prevention, and user verification. Budget is tight — choose wisely!',
    requirements: [
      { label: 'Payments', icon: '💳', description: 'Process payments securely' },
      { label: 'Security', icon: '🔒', description: 'Prevent fraudulent transactions' },
      { label: 'Speed', icon: '⚡', description: 'Fast transaction processing' },
    ],
    stakeholders: [
      { id: 'riders', name: 'Riders', icon: '👤', want: 'Fast & Easy', primaryMetric: 'speed', targetPercent: 75, weight: 0.30 },
      { id: 'drivers', name: 'Drivers', icon: '🚗', want: 'Quick payouts', primaryMetric: 'efficiency', targetPercent: 70, weight: 0.25 },
      { id: 'regulators', name: 'Regulators', icon: '🏛️', want: 'Compliance', primaryMetric: 'trust', targetPercent: 80, weight: 0.25 },
      { id: 'company', name: 'GrabPay', icon: '💼', want: 'Growth', primaryMetric: 'value', targetPercent: 65, weight: 0.20 },
    ],
    hint: 'Payment + Trust habitats are essential. The Payment Gateway + Currency Converter synergy gives a big speed boost.',
    given: {
      habitats: [
        { type: 'marketplace', agents: ['reviewSystem'] },
      ],
    },
    learningObjectives: [
      'Manage limited resources effectively',
      'Understand trade-offs between cost and quality',
      'Balance multiple stakeholder needs',
    ],
    lectureReferences: [
      { layer: 'Layer 3 (Infrastructure)', description: 'Payment processing infrastructure' },
      { layer: 'Layer 5 (Services)', description: 'Security and verification services' },
      { layer: 'SECURE Function', description: 'Trust and fraud prevention' },
    ],
    criticalAgents: ['paymentGateway', 'userAuth'],
    requiredHabitatTypes: ['payment', 'trust'],
  },
  {
    id: 'scenario-3',
    title: 'Cross-Border Challenge',
    subtitle: 'Multi-Stakeholder',
    difficulty: 3,
    timeMinutes: 15,
    credits: 200,
    description: 'Build a cross-border payment system for Thai tourists visiting Laos.',
    briefing: 'Thai tourists visiting Laos need a seamless payment experience. Build a system that handles THB ↔ LAK currency conversion, complies with regulations in both countries, and keeps transaction fees low for local vendors.',
    requirements: [
      { label: 'Speed', icon: '⚡', description: 'Process transactions in < 3 seconds' },
      { label: 'Currency', icon: '💱', description: 'THB ↔ LAK conversion' },
      { label: 'Legal', icon: '📜', description: 'Compliant in both countries' },
    ],
    stakeholders: [
      { id: 'tourists', name: 'Tourists', icon: '👤', want: 'Fast, Easy', primaryMetric: 'speed', targetPercent: 80, weight: 0.25 },
      { id: 'vendors', name: 'Vendors', icon: '🏪', want: 'Low Fees', primaryMetric: 'cost', targetPercent: 70, weight: 0.25 },
      { id: 'regulators', name: 'Regulators', icon: '🏛️', want: 'Legal Compliance', primaryMetric: 'trust', targetPercent: 90, weight: 0.30 },
      { id: 'company', name: 'Your Company', icon: '💼', want: 'Profit', primaryMetric: 'value', targetPercent: 60, weight: 0.20 },
    ],
    hint: 'Start with Payment + Trust habitats. Currency Converter is essential. KYC Verification helps with compliance.',
    learningObjectives: [
      'Design cross-border digital ecosystems',
      'Balance speed, cost, and compliance',
      'Manage stakeholders with conflicting needs',
    ],
    lectureReferences: [
      { layer: 'Layer 1 (Physical-Institutional)', description: 'Dual-country compliance' },
      { layer: 'Layer 4 (Platform)', description: 'Multi-service integration' },
      { layer: 'CONNECT Function', description: 'Payment ↔ Trust migration' },
    ],
    criticalAgents: ['paymentGateway', 'currencyConverter', 'kycVerification'],
    requiredHabitatTypes: ['payment', 'trust'],
  },
  {
    id: 'scenario-4',
    title: 'Smart Agriculture Network',
    subtitle: 'Complex Ecosystem',
    difficulty: 4,
    timeMinutes: 16,
    credits: 250,
    description: 'Connect farmers, buyers, and logistics in a data-driven agricultural ecosystem.',
    briefing: 'Build a smart agriculture network that connects smallholder farmers with buyers, provides logistics tracking, and uses data analytics for market insights. The ecosystem must serve multiple stakeholder groups efficiently.',
    requirements: [
      { label: 'Matching', icon: '🤝', description: 'Connect farmers to buyers efficiently' },
      { label: 'Logistics', icon: '📦', description: 'Track deliveries end-to-end' },
      { label: 'Insights', icon: '📊', description: 'Provide market price analytics' },
      { label: 'Payments', icon: '💰', description: 'Fair and fast payments to farmers' },
    ],
    stakeholders: [
      { id: 'farmers', name: 'Farmers', icon: '👨‍🌾', want: 'Fair prices', primaryMetric: 'value', targetPercent: 75, weight: 0.30 },
      { id: 'buyers', name: 'Buyers', icon: '🏪', want: 'Quality produce', primaryMetric: 'efficiency', targetPercent: 80, weight: 0.25 },
      { id: 'logistics', name: 'Logistics', icon: '🚛', want: 'Efficient routes', primaryMetric: 'speed', targetPercent: 70, weight: 0.20 },
      { id: 'government', name: 'Government', icon: '🏛️', want: 'Food security', primaryMetric: 'trust', targetPercent: 75, weight: 0.25 },
    ],
    hint: 'You need at least 3 habitat types. Marketplace for trading, Data for analytics, and Payment for transactions. Connect them all!',
    learningObjectives: [
      'Design complex multi-habitat ecosystems',
      'Apply all 4 habitat functions',
      'Optimize agent placement across habitats',
    ],
    lectureReferences: [
      { layer: 'Layer 2 (Technology)', description: 'IoT sensors and data collection' },
      { layer: 'Layer 6 (Actors)', description: 'Multiple actor types in ecosystem' },
      { layer: 'OPTIMIZE Function', description: 'Data-driven decision making' },
      { layer: 'CONNECT Function', description: 'Multi-habitat connections' },
    ],
    criticalAgents: ['analyticsEngine', 'deliveryTracker', 'paymentGateway'],
    requiredHabitatTypes: ['marketplace', 'data', 'payment'],
  },
  {
    id: 'scenario-5',
    title: 'Telemedicine Platform',
    subtitle: 'Trust & Security',
    difficulty: 4,
    timeMinutes: 15,
    credits: 220,
    description: 'Build a telemedicine platform serving patients, doctors, and pharmacies with high security.',
    briefing: 'Design a telemedicine ecosystem where patients can consult doctors remotely and order prescriptions. Medical data security is paramount — the Trust habitat is critical. High reliability is required for all components.',
    requirements: [
      { label: 'Consultations', icon: '👨‍⚕️', description: 'Video consultations between patients and doctors' },
      { label: 'Prescriptions', icon: '💊', description: 'Digital prescription management' },
      { label: 'Security', icon: '🔒', description: 'HIPAA-level data protection' },
      { label: 'Payments', icon: '💰', description: 'Insurance and direct payment' },
    ],
    stakeholders: [
      { id: 'patients', name: 'Patients', icon: '🤒', want: 'Easy access', primaryMetric: 'userSatisfaction', targetPercent: 80, weight: 0.30 },
      { id: 'doctors', name: 'Doctors', icon: '👨‍⚕️', want: 'Reliable tools', primaryMetric: 'efficiency', targetPercent: 85, weight: 0.25 },
      { id: 'pharmacies', name: 'Pharmacies', icon: '💊', want: 'Order accuracy', primaryMetric: 'speed', targetPercent: 75, weight: 0.20 },
      { id: 'regulators', name: 'Health Board', icon: '🏛️', want: 'Data compliance', primaryMetric: 'trust', targetPercent: 90, weight: 0.25 },
    ],
    hint: 'Trust habitat is absolutely critical here. KYC + Fraud Detection synergy gives +20% Trust. Don\'t skimp on security!',
    learningObjectives: [
      'Understand the importance of trust in digital ecosystems',
      'Design high-reliability systems',
      'Balance accessibility with security',
    ],
    lectureReferences: [
      { layer: 'Layer 6 (Actors)', description: 'Patient, Doctor, Pharmacy actors' },
      { layer: 'Layer 5 (Services)', description: 'Healthcare digital services' },
      { layer: 'SECURE Function', description: 'Medical data protection' },
    ],
    criticalAgents: ['userAuth', 'kycVerification', 'fraudDetection'],
    requiredHabitatTypes: ['trust', 'marketplace'],
  },
  {
    id: 'scenario-6',
    title: 'ASEAN Integration Master',
    subtitle: 'Ultimate Challenge',
    difficulty: 5,
    timeMinutes: 18,
    credits: 365,
    description: 'Connect 3 ASEAN countries in a unified digital ecosystem — the ultimate test.',
    briefing: 'Build the ultimate cross-border digital ecosystem connecting Thailand, Laos, and Vietnam. Handle multiple currencies (THB, LAK, VND), comply with 3 different regulatory frameworks, and serve diverse stakeholders across all countries. This is the final test of your ecosystem architecture skills.',
    requirements: [
      { label: 'Multi-Currency', icon: '💱', description: 'Handle THB, LAK, and VND' },
      { label: 'Compliance', icon: '📜', description: 'Meet regulations in 3 countries' },
      { label: 'Trade', icon: '🤝', description: 'Cross-border marketplace' },
      { label: 'Data', icon: '📊', description: 'Unified analytics across borders' },
      { label: 'Innovation', icon: '💡', description: 'Future-proof architecture' },
    ],
    stakeholders: [
      { id: 'users', name: 'Users (3 countries)', icon: '👥', want: 'Seamless experience', primaryMetric: 'userSatisfaction', targetPercent: 80, weight: 0.25 },
      { id: 'businesses', name: 'Businesses', icon: '🏪', want: 'Market access', primaryMetric: 'efficiency', targetPercent: 75, weight: 0.25 },
      { id: 'regulators', name: 'Regulators (3)', icon: '🏛️', want: 'Full compliance', primaryMetric: 'trust', targetPercent: 85, weight: 0.30 },
      { id: 'investors', name: 'Investors', icon: '💼', want: 'Scalability', primaryMetric: 'value', targetPercent: 70, weight: 0.20 },
    ],
    hint: 'You need ALL habitat types for this one. Build Payment + Trust first for compliance, then Marketplace for trade, Data for analytics, and Innovation for scalability.',
    learningObjectives: [
      'Master full ecosystem integration',
      'Apply all 7 layers of the architecture',
      'Design scalable cross-border systems',
    ],
    lectureReferences: [
      { layer: 'Layer 1 (Physical-Institutional)', description: 'Multi-country regulatory compliance' },
      { layer: 'Layer 2 (Technology)', description: 'Cross-border infrastructure' },
      { layer: 'Layer 3 (Infrastructure)', description: 'Multi-currency payment rails' },
      { layer: 'Layer 4 (Platform)', description: 'Unified digital platform' },
      { layer: 'Layer 5 (Services)', description: 'Localized services per country' },
      { layer: 'Layer 6 (Actors)', description: 'Diverse stakeholder ecosystem' },
      { layer: 'Layer 7 (Governance)', description: 'Cross-border governance framework' },
    ],
    criticalAgents: ['paymentGateway', 'currencyConverter', 'kycVerification', 'analyticsEngine'],
    requiredHabitatTypes: ['marketplace', 'payment', 'data', 'trust', 'innovation'],
  },
];

// ============================================================
// ACHIEVEMENTS
// ============================================================
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-build', name: 'First Build', icon: '🏗️', description: 'Complete the Tutorial scenario', requirement: 'Complete Scenario 1', reward: '+50 Credits', unlocked: false },
  { id: 'synergy-master', name: 'Synergy Master', icon: '💡', description: 'Discover 5 different synergies', requirement: 'Activate 5 unique synergies across all games', reward: '+20% synergy bonus', unlocked: false },
  { id: 'balanced-architect', name: 'Balanced Architect', icon: '⚖️', description: 'Score 80%+ on all stakeholders in one scenario', requirement: 'All stakeholders above 80%', reward: 'Unlock Advanced Scenarios', unlocked: false },
  { id: 'asean-connector', name: 'ASEAN Connector', icon: '🌏', description: 'Complete the ASEAN Integration Master scenario', requirement: 'Complete Scenario 6', reward: '"Master Architect" title', unlocked: false },
  { id: 'lecture-expert', name: 'Lecture Expert', icon: '📚', description: 'Reference all 7 layers across your games', requirement: 'Complete scenarios covering all 7 layers', reward: 'Study mode unlocked', unlocked: false },
  { id: 'budget-hero', name: 'Budget Hero', icon: '💰', description: 'Complete a scenario with 30%+ credits remaining', requirement: 'Finish with lots of credits left', reward: '+25 starting credits', unlocked: false },
  { id: 'speed-runner', name: 'Speed Runner', icon: '⚡', description: 'Complete a scenario in under half the time limit', requirement: 'Finish very quickly', reward: 'Time bonus multiplier', unlocked: false },
  { id: 'perfect-score', name: 'Perfect Score', icon: '🌟', description: 'Achieve 95%+ overall score on any scenario', requirement: 'Near-perfect ecosystem design', reward: 'Gold frame for profile', unlocked: false },
];
