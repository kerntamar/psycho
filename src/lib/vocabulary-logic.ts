export interface WordProgress {
  word_id: string;
  next_review: Date;
  interval: number; // in days
  ease_factor: number;
  streak: number;
}

/**
 * SuperMemo-2 (SM-2) algorithm for spaced repetition
 * @param quality: 0-5 (0: total blackout, 5: perfect response)
 * @param prevInterval: previous interval in days
 * @param prevEaseFactor: previous ease factor (default 2.5)
 */
export function calculateNextReview(
  quality: number,
  prevInterval: number,
  prevEaseFactor: number,
  currentStreak: number
): { interval: number; easeFactor: number; streak: number; nextReview: Date } {
  let nextInterval: number;
  let nextEaseFactor: number;
  let nextStreak: number;

  if (quality >= 3) {
    // Correct response
    if (currentStreak === 0) {
      nextInterval = 1;
    } else if (currentStreak === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(prevInterval * prevEaseFactor);
    }
    nextStreak = currentStreak + 1;
    nextEaseFactor = prevEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    // Incorrect response
    nextInterval = 1;
    nextStreak = 0;
    nextEaseFactor = prevEaseFactor;
  }

  if (nextEaseFactor < 1.3) {
    nextEaseFactor = 1.3;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + nextInterval);

  return {
    interval: nextInterval,
    easeFactor: nextEaseFactor,
    streak: nextStreak,
    nextReview
  };
}
