import { getGuessStatuses } from './statuses';
import { solutionIndex } from './words';
import { GAME_TITLE } from '../constants/strings';
import { submitWord } from '../api';

export const shareStatus = async (guesses: string[], lost: boolean) => {
  const emojiiGrid = await generateEmojiGrid(guesses);
  navigator.clipboard.writeText(
    `${GAME_TITLE} ${lost ? 'X' : guesses.length}/6\n\n` + emojiiGrid
  );
};

export const generateEmojiGrid = async (guesses: string[]) => {
  const promises = guesses.map(async (guess) => {
    const status = await submitWord(guess);
    return guess
      .split('')
      .map((letter, i) => {
        switch (status[i]) {
          case 'correct':
            return '🟩';
          case 'present':
            return '🟨';
          default:
            return '⬜';
        }
      })
      .join('');
  });
  const results = await Promise.all(promises);
  console.log('results', results);
  return results.join('\n');
};
