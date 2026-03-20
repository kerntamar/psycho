"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Trophy, RotateCcw } from "lucide-react";

interface Card {
  id: number;
  content: string;
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);

  const initialPairs = [
    { word: "Resilient", translation: "חסין" },
    { word: "Coherent", translation: "עקבי" },
    { word: "Pragmatic", translation: "מעשי" },
    { word: "Diligent", translation: "חרוץ" },
    { word: "Eloquent", translation: "רהוט" },
    { word: "Tenacious", translation: "עיקש" },
  ];

  const initGame = () => {
    const gameCards: Card[] = [];
    initialPairs.forEach((pair, index) => {
      gameCards.push(
        { id: index * 2, content: pair.word, pairId: index, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, content: pair.translation, pairId: index, isFlipped: false, isMatched: false }
      );
    });
    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards.find(c => c.id === id)?.isMatched || cards.find(c => c.id === id)?.isFlipped) return;

    const newCards = cards.map(card => card.id === id ? { ...card, isFlipped: true } : card);
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);

    if (flippedCards.length === 1) {
      setMoves(moves + 1);
      const firstCard = cards.find(c => c.id === flippedCards[0])!;
      const secondCard = newCards.find(c => c.id === id)!;

      if (firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.pairId === firstCard.pairId ? { ...card, isMatched: true } : card
          ));
          setMatches(m => m + 1);
          setFlippedCards([]);
        }, 600);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            (card.id === firstCard.id || card.id === secondCard.id) ? { ...card, isFlipped: false } : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-12 px-6 bg-slate-50/50 rounded-3xl border-2 border-slate-100">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="bg-white px-6 py-4 rounded-2xl border-2 border-slate-100 shadow-sm flex items-center space-x-3 group transition-all hover:border-indigo-200">
            <Trophy className="w-6 h-6 text-indigo-500 group-hover:scale-125 transition-transform" />
            <span className="font-black text-slate-700 text-xl">{matches}/{initialPairs.length}</span>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl border-2 border-slate-100 shadow-sm flex items-center space-x-3 transition-all hover:border-orange-200 group">
            <Sparkles className="w-6 h-6 text-orange-500 group-hover:scale-125 transition-transform" />
            <span className="font-black text-slate-700 text-xl">{moves} Moves</span>
          </div>
        </div>
        <button
          onClick={initGame}
          className="bg-slate-900 text-white p-5 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center space-x-3 active:scale-95 shadow-lg"
        >
          <RotateCcw className="w-6 h-6" /> <span className="text-lg">Reset</span>
        </button>
      </header>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={cn(
              "h-48 rounded-3xl cursor-pointer transition-all duration-500 [transform-style:preserve-3d] shadow-md hover:shadow-xl hover:-translate-y-1",
              card.isFlipped || card.isMatched ? "[transform:rotateY(180deg)]" : ""
            )}
          >
            {/* Card Back */}
            <div className="absolute inset-0 bg-white border-2 border-slate-200 rounded-3xl [backface-visibility:hidden] flex items-center justify-center p-4">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl border-2 border-slate-100 flex items-center justify-center">
                <span className="text-4xl text-slate-200 font-black">?</span>
              </div>
            </div>
            {/* Card Front */}
            <div className={cn(
              "absolute inset-0 border-4 rounded-3xl [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center p-6 text-center transition-all duration-500 shadow-inner",
              card.isMatched ? "bg-green-500 border-green-400 text-white" : "bg-indigo-600 border-indigo-500 text-white"
            )}>
              <span className="text-2xl font-black tracking-tight leading-snug">{card.content}</span>
            </div>
          </div>
        ))}
      </div>

      {matches === initialPairs.length && (
        <div className="text-center p-12 bg-white rounded-3xl border-4 border-green-500 shadow-2xl animate-in zoom-in-95 duration-500">
          <h2 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">Well Done! 🎉</h2>
          <p className="text-2xl text-slate-500 font-medium mb-10 leading-relaxed">You mastered all {initialPairs.length} vocabulary words in just {moves} moves.</p>
          <div className="flex justify-center space-x-6">
             <button onClick={initGame} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl active:scale-95">Play Again</button>
             <button className="bg-slate-100 text-slate-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-200 transition-all shadow-sm">View List</button>
          </div>
        </div>
      )}
    </div>
  );
}
