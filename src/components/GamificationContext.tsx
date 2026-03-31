"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface GamificationContextType {
  xp: number;
  streak: number;
  level: number;
  addXP: (amount: number) => void;
  updateStreak: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);

  const addXP = (amount: number) => {
    setXP(prev => prev + amount);
  };

  const updateStreak = () => {
    setStreak(prev => prev + 1);
  };

  useEffect(() => {
    const newLevel = Math.floor(xp / 1000) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
    }
  }, [xp, level]);

  return (
    <GamificationContext.Provider value={{ xp, streak, level, addXP, updateStreak }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
