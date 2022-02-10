import { CharStatus } from './statuses';

export type KeyStates = { [key: string]: CharStatus };

export const getKeyStates = (
  guess: string,
  charStatuses: CharStatus[],
  existingStates: KeyStates
): KeyStates => {
  const states: KeyStates = { ...existingStates };
  charStatuses.forEach((status, index) => {
    const letter = guess[index];
    if (states[letter] === 'present' && status === 'absent') {
      // continue
    } else if (states[letter] === 'correct') {
      // continue
    } else {
      states[letter] = status;
    }
  });
  return states;
};
