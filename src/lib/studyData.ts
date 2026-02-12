export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ConceptReview {
  id: string;
  title: string;
  description: string;
  examples: string[];
  lectureSlide: string;
}

export const FLASHCARDS: Flashcard[] = [
  // 7 Layers
  { id: 'f1', question: 'What is Layer 1 in the Digital Business Ecosystem?', answer: 'Physical-Institutional Layer — The physical infrastructure and institutional rules (laws, regulations, standards) that form the foundation of the ecosystem.', category: '7 Layers' },
  { id: 'f2', question: 'What is Layer 2?', answer: 'Technology Layer — The core technologies (internet, mobile, IoT, blockchain) that enable digital interactions.', category: '7 Layers' },
  { id: 'f3', question: 'What is Layer 3?', answer: 'Infrastructure Layer — The shared digital infrastructure (cloud, APIs, payment rails) that services are built upon.', category: '7 Layers' },
  { id: 'f4', question: 'What is Layer 4?', answer: 'Digital Platform Layer — The platforms (apps, websites, marketplaces) where actors interact and transact.', category: '7 Layers' },
  { id: 'f5', question: 'What is Layer 5?', answer: 'Services Layer — The digital services (payments, logistics, analytics) offered through the platform.', category: '7 Layers' },
  { id: 'f6', question: 'What is Layer 6?', answer: 'Actors Layer — The participants (users, businesses, regulators) who interact within the ecosystem.', category: '7 Layers' },
  { id: 'f7', question: 'What is Layer 7?', answer: 'Governance Layer — The rules, policies, and mechanisms that govern how the ecosystem operates and evolves.', category: '7 Layers' },

  // Habitat Functions
  { id: 'f8', question: 'What is the CONNECT function of a habitat?', answer: 'CONNECT enables agents and services to link, communicate, and share resources across habitats. It facilitates migration and data flow between different parts of the ecosystem.', category: 'Habitat Functions' },
  { id: 'f9', question: 'What is the SECURE function of a habitat?', answer: 'SECURE provides trust, authentication, fraud prevention, and regulatory compliance. It ensures the ecosystem is safe for all participants.', category: 'Habitat Functions' },
  { id: 'f10', question: 'What is the OPTIMIZE function of a habitat?', answer: 'OPTIMIZE uses data and analytics to improve efficiency, reduce costs, and enhance decision-making within the ecosystem.', category: 'Habitat Functions' },
  { id: 'f11', question: 'What is the EVOLVE function of a habitat?', answer: 'EVOLVE enables innovation, experimentation, and adaptation. It allows the ecosystem to grow and respond to changing needs through prototyping and testing.', category: 'Habitat Functions' },

  // Habitats
  { id: 'f12', question: 'What is a Marketplace habitat?', answer: 'A digital space where buyers and sellers meet. It hosts agents like Review Systems and Delivery Trackers. Bonus: +10% User Satisfaction.', category: 'Habitats' },
  { id: 'f13', question: 'What is a Payment habitat?', answer: 'A habitat for financial transactions. It hosts Payment Gateways and Currency Converters. Bonus: +15% Transaction Speed.', category: 'Habitats' },
  { id: 'f14', question: 'What is a Data habitat?', answer: 'A habitat for analytics and intelligence. It hosts Analytics Engines and Recommendation AIs. Bonus: +10% System Efficiency.', category: 'Habitats' },
  { id: 'f15', question: 'What is a Trust habitat?', answer: 'A habitat for security and compliance. It hosts User Auth, Fraud Detection, and KYC Verification. Bonus: +20% Compliance Score.', category: 'Habitats' },
  { id: 'f16', question: 'What is an Innovation habitat?', answer: 'A habitat for experimentation and evolution. It hosts Prototype Labs and A/B Testing. Bonus: Faster Evolution.', category: 'Habitats' },

  // Stakeholders & Trade-offs
  { id: 'f17', question: 'Why is stakeholder management important in ecosystem design?', answer: 'Different stakeholders have conflicting priorities (speed vs. cost vs. compliance). A successful ecosystem must balance these needs to achieve overall satisfaction above the minimum threshold.', category: 'Stakeholders' },
  { id: 'f18', question: 'What is agent synergy?', answer: 'When two compatible agents are placed in the same ecosystem, they create bonus effects. For example, Payment Gateway + Currency Converter = +15% Speed.', category: 'Agents' },
  { id: 'f19', question: 'What happens when an agent is placed in the wrong habitat?', answer: 'A -15% penalty is applied to the ecosystem score. Agents perform best in their designated habitat type.', category: 'Agents' },
  { id: 'f20', question: 'What is agent migration?', answer: 'When habitats are connected, compatible agents can travel between them, serving multiple habitats and creating cross-habitat synergies. Each connection gives +5% efficiency.', category: 'Migration' },
];

export const CONCEPT_REVIEWS: ConceptReview[] = [
  {
    id: 'c1',
    title: '4 Habitat Functions',
    description: 'Every digital ecosystem habitat serves one or more of four core functions that enable the ecosystem to thrive.',
    examples: [
      'CONNECT — Payment ↔ Marketplace link enables seamless checkout',
      'SECURE — Trust habitat with KYC + Fraud Detection protects users',
      'OPTIMIZE — Data habitat with Analytics improves decision-making',
      'EVOLVE — Innovation habitat with Prototype Lab enables experimentation',
    ],
    lectureSlide: 'Slides 22-23',
  },
  {
    id: 'c2',
    title: '7-Layer Architecture',
    description: 'The Digital Business Ecosystem is built on 7 layers, from physical infrastructure to governance.',
    examples: [
      'L1: Physical laws & regulations (e.g., cross-border compliance)',
      'L2: Technology (internet, mobile, IoT)',
      'L3: Infrastructure (cloud, APIs, payment rails)',
      'L4: Platform (the app/website)',
      'L5: Services (payments, logistics, analytics)',
      'L6: Actors (users, businesses, regulators)',
      'L7: Governance (rules, policies, standards)',
    ],
    lectureSlide: 'Slides 10-16',
  },
  {
    id: 'c3',
    title: 'Stakeholder Types & Priorities',
    description: 'Each ecosystem serves multiple stakeholders with different and sometimes conflicting needs.',
    examples: [
      'End Users — Want speed, ease of use, low cost',
      'Businesses — Want efficiency, market access, profit',
      'Regulators — Want compliance, security, transparency',
      'Investors — Want scalability, growth, return on investment',
    ],
    lectureSlide: 'Slide 11',
  },
  {
    id: 'c4',
    title: 'Trade-offs in Ecosystem Design',
    description: 'Resources are limited. Every design choice involves trade-offs between competing priorities.',
    examples: [
      'Speed vs. Security — Faster processing may reduce verification steps',
      'Cost vs. Quality — Cheaper agents have lower efficiency/reliability',
      'Breadth vs. Depth — More habitats vs. upgrading existing ones',
      'Innovation vs. Stability — New features vs. proven reliability',
    ],
    lectureSlide: 'Slide 13',
  },
  {
    id: 'c5',
    title: 'Evolution & Adaptation',
    description: 'Ecosystems must evolve to survive. Combination scoring rewards well-designed, synergistic ecosystems.',
    examples: [
      'Agent synergies create emergent capabilities',
      'Habitat upgrades unlock new capacity and abilities',
      'Connections enable migration and cross-pollination',
      'Innovation habitat accelerates the evolution cycle',
    ],
    lectureSlide: 'Slides 18-19',
  },
];

export const FLASHCARD_CATEGORIES = [...new Set(FLASHCARDS.map((f) => f.category))];
