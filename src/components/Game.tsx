'use client';

import { useGameStore } from '@/lib/store';
import MainMenu from './MainMenu';
import PlanPhase from './PlanPhase';
import BuildPhase from './BuildPhase';
import ReviewPhase from './ReviewPhase';
import StudyMode from './StudyMode';
import HowToPlay from './HowToPlay';

export default function Game() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);

  switch (phase) {
    case 'menu':
      return <MainMenu />;
    case 'plan':
      return <PlanPhase />;
    case 'build':
      return <BuildPhase />;
    case 'review':
      return <ReviewPhase />;
    case 'study':
      return <StudyMode onBack={() => setPhase('menu')} />;
    case 'howtoplay':
      return <HowToPlay onBack={() => setPhase('menu')} />;
    default:
      return <MainMenu />;
  }
}
