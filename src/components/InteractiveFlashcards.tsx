"use client";

import React, { useState } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { RefreshCw, X, Check } from 'lucide-react';

// Interfaces for card data
interface Flashcard {
  id?: string;
  question: string;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
  category?: string;
}

interface FlashcardData {
  title: string;
  flashcards: Flashcard[];
}

interface InteractiveFlashcardsProps {
  data?: FlashcardData;
  flashcards?: Flashcard[];
  studyMode?: 'sequential' | 'random';
}

// Spring helpers
const to = (i: number) => ({ x: 0, y: 0, scale: 1, rot: 0, delay: i * 50 });
const from = () => ({ x: 0, rot: 0, scale: 1, y: -1000 });

function Deck({ data, studyMode = 'sequential' }: { data: FlashcardData; studyMode?: 'sequential' | 'random' }) {
  const [gone] = useState(() => new Set());
  const [flipped, setFlipped] = useState<number[]>([]);

  if (process.env.NODE_ENV === 'development') {
    console.log('Deck component - flashcards data:', data.flashcards);
    console.log('Study mode:', studyMode);
  }

  // Shuffle flashcards if random mode is selected
  const [shuffledFlashcards] = useState(() => {
    if (studyMode === 'random') {
      const shuffled = [...data.flashcards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    return data.flashcards;
  });
  
  const displayData = { ...data, flashcards: shuffledFlashcards };
  
  const [props, api] = useSprings(displayData.flashcards.length, i => ({ ...to(i), from: from() }));

  const triggerSwipe = (index: number, direction: 'left' | 'right') => {
    if (gone.has(index)) return;
    gone.add(index);
    setFlipped(prev => prev.filter(i => i !== index)); // Unflip card when it's swiped away
    const dir = direction === 'left' ? -1 : 1;
    api.start(i => {
      if (index !== i) return;
      return {
        x: (200 + window.innerWidth) * dir,
        rot: dir * 15,
        config: { friction: 50, tension: 200 },
      };
    });
  };

  const bind = useDrag(({ args: [index], active, movement: [mx], direction: [xDir], velocity: [vx], tap }) => {
    // If it's a tap gesture, flip the card
    if (tap) {
      setFlipped(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
      return;
    }
    
    // If it's a drag gesture
    const trigger = vx > 0.2 && Math.abs(mx) > window.innerWidth / 5;
    if (!active && trigger) {
      const dir = xDir < 0 ? -1 : 1;
      triggerSwipe(index, dir === -1 ? 'left' : 'right');
    }

    api.start(i => {
      if (index !== i) return;
      const isGone = gone.has(index);
      if (isGone) return; // Don't allow dragging a card that's already gone

      const x = active ? mx : 0;
      const rot = mx / 20;
      const scale = active ? 1.05 : 1;
      
      return { x, rot, scale, config: { friction: 50, tension: active ? 800 : 500 } };
    });
  });

  const handleReset = () => {
    gone.clear();
    setFlipped([]);
    setTimeout(() => api.start(i => to(i)), 400);
  };
  
  const cardsLeft = displayData.flashcards.length - gone.size;
  const currentCardIndex = displayData.flashcards.length - cardsLeft;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full font-sans pt-8">
        <div className="w-full max-w-sm h-96 relative flex items-center justify-center">
            {props.map(({ x, rot }, i) => {
              if (i < currentCardIndex || i > currentCardIndex + 2) return null;

              if (process.env.NODE_ENV === 'development') {
              console.log(`Card ${i}:`, {
                question: displayData.flashcards[i]?.question,
                answer: displayData.flashcards[i]?.answer,
                isFlipped: flipped.includes(i)
              });
            }

              return (
                <animated.div
                  key={i}
                  {...(i === currentCardIndex ? bind(i) : {})} // The drag handler is now on the top-level animated div
                  className="absolute w-full h-full cursor-grab active:cursor-grabbing select-none"
                  style={{
                    x,
                    y: (i - currentCardIndex) * -10,
                    scale: 1 - (i - currentCardIndex) * 0.05,
                    zIndex: displayData.flashcards.length - i,
                    transform: interpolate([rot], (r) => `rotate(${r}deg)`),
                  }}
                >
                  <div
                    className="relative w-full h-full"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: flipped.includes(i) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transition: 'transform 0.6s',
                    }}
                  >
                    {/* Card Front (Question) */}
                    <div 
                      className="absolute w-full h-full p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 flex flex-col"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="flex-grow overflow-y-auto custom-scrollbar p-4 flex items-center justify-center" style={{ touchAction: 'pan-y' }}>
                        <div className="text-center">
                          <p className="text-lg font-medium text-zinc-800 dark:text-zinc-100 leading-relaxed">
                            {displayData.flashcards[i]?.question || 'No question available'}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-center text-xs text-zinc-400 p-2">
                        <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                          Question
                        </span>
                        <div className="mt-1">Click to see answer</div>
                      </div>
                    </div>

                    {/* Card Back (Answer) */}
                    <div 
                      className="absolute w-full h-full p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 flex flex-col" 
                      style={{ 
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                       <div className="flex-grow overflow-y-auto custom-scrollbar p-4 flex items-center justify-center" style={{ touchAction: 'pan-y' }}>
                         <div className="text-center">
                           <p className="text-lg text-zinc-800 dark:text-zinc-100 leading-relaxed">
                             {displayData.flashcards[i]?.answer || 'No answer available'}
                           </p>
                         </div>
                       </div>
                       <div className="flex-shrink-0 text-center text-xs text-zinc-400 p-2">
                         <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                           Answer
                         </span>
                         <div className="mt-1">Click to see question</div>
                       </div>
                    </div>
                  </div>
                </animated.div>
              );
            })}
        </div>

        {/* Controls and Status */}
        <div className="mt-6 text-center w-full max-w-sm h-24 flex items-center justify-center">
            {cardsLeft > 0 ? (
              <div className="flex justify-center items-center gap-6">
                  <button onClick={() => triggerSwipe(currentCardIndex, 'left')} className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-700 text-red-500 hover:scale-110 transition-transform" aria-label="Incorrect">
                    <X size={28} />
                  </button>
                  <p className="text-lg font-semibold text-zinc-600 dark:text-zinc-300 w-24">
                    {currentCardIndex + 1} / {displayData.flashcards.length}
                  </p>
                  <button onClick={() => triggerSwipe(currentCardIndex, 'right')} className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-700 text-green-500 hover:scale-110 transition-transform" aria-label="Correct">
                    <Check size={28} />
                  </button>
              </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <p className="text-xl font-bold text-emerald-500">Deck complete! 🎉</p>
                    <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 font-semibold text-zinc-600 dark:text-zinc-200 bg-zinc-200 dark:bg-zinc-700 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        <span>Study Again</span>
                    </button>
                </div>
            )}
        </div>
    </div>
  );
}

// Wrapper component
const InteractiveFlashcards = ({ data, flashcards, studyMode = 'sequential' }: InteractiveFlashcardsProps) => {
    // Handle both old and new prop formats
    let flashcardData: FlashcardData;
    
    if (data) {
        // Old format with data prop
        flashcardData = data;
    } else if (flashcards) {
        // New format with flashcards prop
        flashcardData = {
            title: 'Flashcards',
            flashcards: flashcards
        };
    } else {
        return <div className="text-center text-zinc-500">No flashcards to display.</div>;
    }
    
    if (process.env.NODE_ENV === 'development') {
    console.log('InteractiveFlashcards flashcardData:', flashcardData);
    console.log('Flashcards:', flashcardData.flashcards);
    }
    
    if (!flashcardData.flashcards || flashcardData.flashcards.length === 0) {
      return <div className="text-center text-zinc-500">No flashcards to display.</div>;
    }
    
    return <Deck data={flashcardData} studyMode={studyMode} />;
};

export default InteractiveFlashcards;