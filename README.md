# EcoArchitect — DBES Habitat Simulation

A strategic simulation game where students design digital ecosystems using the Habitat Model. Built for the CMU ICDI Digital Business Ecosystem course.

## Features

- **6 Scenarios** with increasing difficulty (Tutorial → ASEAN Integration Master)
- **5 Habitat Types**: Marketplace, Payment, Data, Trust, Innovation
- **12 Agent Types** with efficiency/reliability attributes and synergy bonuses
- **3-Phase Gameplay**: Plan → Build → Review
- **Real-time Scoring** with stakeholder satisfaction, synergies, and penalties
- **Drag-and-Drop** habitat and agent placement
- **Habitat Connections** with migration visualization
- **Habitat Upgrades** (3 levels)
- **Study Mode** with flashcards and concept review
- **How to Play** interactive guide
- **Progress Persistence** via localStorage

## Tech Stack

- **Next.js 15** (App Router)
- **React 18** + TypeScript
- **Tailwind CSS 3**
- **Zustand** (state management)
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **@dnd-kit** (drag and drop)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                  # Next.js app router
│   ├── globals.css       # Global styles + animations
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Entry point
├── components/           # React components
│   ├── Game.tsx          # Phase router
│   ├── MainMenu.tsx      # Scenario selection
│   ├── PlanPhase.tsx     # Request analysis screen
│   ├── BuildPhase.tsx    # Main building board
│   ├── ReviewPhase.tsx   # Results & feedback
│   ├── StudyMode.tsx     # Flashcards & concepts
│   └── HowToPlay.tsx     # Tutorial guide
└── lib/                  # Core logic
    ├── types.ts          # TypeScript interfaces
    ├── gameData.ts       # Habitats, agents, scenarios, achievements
    ├── scoring.ts        # Scoring engine
    ├── store.ts          # Zustand game state
    └── studyData.ts      # Flashcards & concept reviews
```

## Game Mechanics

- **Credits**: Buy habitats (35-60) and agents (15-35). Connections cost 10.
- **Synergies**: Agent pairs like Payment Gateway + Currency Converter = +15% Speed
- **Scoring**: Base score + habitat match + synergies + connections - penalties
- **Pass threshold**: 70% overall stakeholder satisfaction
- **Stars**: ⭐ 70%+ | ⭐⭐ 80%+ | ⭐⭐⭐ 90%+

## Course

CMU ICDI — Digital Business Ecosystem • EcoArchitect v3.0
