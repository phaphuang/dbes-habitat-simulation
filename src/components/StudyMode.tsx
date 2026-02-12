'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FLASHCARDS, CONCEPT_REVIEWS, FLASHCARD_CATEGORIES } from '@/lib/studyData';
import {
  BookOpen, ChevronLeft, ChevronRight, RotateCcw, Eye, EyeOff,
  GraduationCap, ArrowLeft, Layers, Filter
} from 'lucide-react';

export default function StudyMode({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'flashcards' | 'concepts'>('flashcards');
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCards = selectedCategory
    ? FLASHCARDS.filter((f) => f.category === selectedCategory)
    : FLASHCARDS;

  const card = filteredCards[currentCard];

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentCard((prev) => (prev + 1) % filteredCards.length);
  };

  const prevCard = () => {
    setShowAnswer(false);
    setCurrentCard((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const resetCards = () => {
    setShowAnswer(false);
    setCurrentCard(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Menu
        </button>
        <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <GraduationCap size={20} className="text-indigo-400" />
          Study Mode
        </h1>
        <div className="w-24" />
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center gap-2 px-6 py-4">
        <button
          onClick={() => setTab('flashcards')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            tab === 'flashcards'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
          }`}
        >
          <BookOpen size={14} /> Flashcards
        </button>
        <button
          onClick={() => setTab('concepts')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            tab === 'concepts'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
          }`}
        >
          <Layers size={14} /> Concept Review
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 py-4 overflow-y-auto">
        {tab === 'flashcards' ? (
          <div className="max-w-xl w-full">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              <button
                onClick={() => { setSelectedCategory(null); resetCards(); }}
                className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  !selectedCategory
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 hover:border-slate-600'
                }`}
              >
                All ({FLASHCARDS.length})
              </button>
              {FLASHCARD_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCurrentCard(0); setShowAnswer(false); }}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {cat} ({FLASHCARDS.filter((f) => f.category === cat).length})
                </button>
              ))}
            </div>

            {/* Flashcard */}
            {card && (
              <div className="space-y-4">
                <div className="text-center text-xs text-slate-500 mb-2">
                  Card {currentCard + 1} of {filteredCards.length}
                </div>

                <motion.div
                  key={card.id + (showAnswer ? '-a' : '-q')}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 min-h-[220px] flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-600 transition-colors"
                >
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-4">
                    {showAnswer ? '💡 Answer' : '❓ Question'} — {card.category}
                  </div>
                  <p className={`text-lg leading-relaxed ${showAnswer ? 'text-emerald-300' : 'text-slate-200'}`}>
                    {showAnswer ? card.answer : card.question}
                  </p>
                  <div className="mt-6 text-xs text-slate-600">
                    {showAnswer ? 'Click to see question' : 'Click to reveal answer'}
                  </div>
                </motion.div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={prevCard}
                    className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg px-4 py-2.5 text-sm transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="flex items-center gap-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg px-4 py-2.5 text-sm transition-colors cursor-pointer"
                  >
                    {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showAnswer ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={nextCard}
                    className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg px-4 py-2.5 text-sm transition-colors cursor-pointer"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>

                {/* Progress */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentCard + 1) / filteredCards.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Concept Review */
          <div className="max-w-2xl w-full space-y-4">
            {CONCEPT_REVIEWS.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ConceptCard({ concept }: { concept: typeof CONCEPT_REVIEWS[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{concept.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{concept.lectureSlide}</p>
        </div>
        <ChevronRight
          size={16}
          className={`text-slate-500 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 border-t border-slate-700/50 pt-3">
              <p className="text-sm text-slate-300 mb-3">{concept.description}</p>
              <div className="space-y-1.5">
                {concept.examples.map((ex, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
