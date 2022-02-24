import { WORDS } from '../constants/wordlist';
import { CharStatus } from './statuses';
import { VALID_GUESSES } from '../constants/validGuesses'

export const isWordInWordList = (word: string) => {
  return (
    true
  )
}

export const isWinningWord = (statuses: CharStatus[]) => {
  let isWinning = true;
  statuses.forEach((status) => {
    if (status !== 'correct') {
      isWinning = false;
    }
  });
  return isWinning;
};

export const getWordOfDay = () => {
  // January 1, 2022 Game Epoch
  const epochMs = new Date('January 1, 2022 00:00:00').valueOf();
  const now = Date.now();
  const msInDay = 86400000;
  const index = Math.floor((now - epochMs) / msInDay);
  const nextday = (index + 1) * msInDay + epochMs;
  console.log("index", index, nextday)
  return {
    solution: "not a real solution",
    solutionIndex: index,
    tomorrow: nextday,
  };
};

export const { solution, solutionIndex, tomorrow } = getWordOfDay();
