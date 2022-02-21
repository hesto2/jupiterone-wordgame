import { getGuessStatuses } from './statuses';
import { solutionIndex } from './words';
import { GAME_TITLE } from '../constants/strings';
import { submitWord } from '../api';
export const shareStatus = async (
  guesses: string[],
  lost: boolean,
  wordId: number | null
) => {

  var iOS = /(iP*)/g.test(navigator.userAgent)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  console.log(isSafari, 'isSafari')
  if (!isSafari) {
    const emojiiGrid = await generateEmojiGrid(guesses);

    navigator.clipboard.writeText(
      `JupiterOne Cybersecurity Word Game ${wordId || ''} ${lost ? '6' : guesses.length}/6\n\n` +
      emojiiGrid +
      '\n\n Play free: https://www.jupiterone.com/wordgame'
    );
  } else {
    const bringResponse = async () => {
      const response = await generateEmojiGrid(guesses);
      return (
        `JupiterOne Cybersecurity Word Game ${wordId || ''} ${lost ? '6' : guesses.length
        }/6\n\n` +
        response +
        '\n\n Play free: https://www.jupiterone.com/wordgame');
    }
    console.log('navigator', navigator)
    navigator.clipboard.write([new ClipboardItem({ "text/plain": bringResponse() })])
      .then(function () { console.log('copied'); })
      .catch(function (error) { console.log(error); });
  }
}

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
  return results.join('\n');
};