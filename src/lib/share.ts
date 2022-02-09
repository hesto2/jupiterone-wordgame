import { getGuessStatuses } from './statuses';
import { solutionIndex } from './words';
import { GAME_TITLE } from '../constants/strings';
import { submitWord } from '../api';

export const shareStatus = async (
  guesses: string[],
  lost: boolean,
  wordId: number | null
) => {
  const emojiiGrid = await generateEmojiGrid(guesses);
  navigator.clipboard.writeText(
    `JupiterOne Cybersecurity Word Game ${wordId || ''} ${
      lost ? '6' : guesses.length
    }/6\n\n` +
      emojiiGrid +
      '\n\n Play free: https://www.jupiterone.com/wordgame'
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
