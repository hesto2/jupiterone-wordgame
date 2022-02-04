import { CharStatus } from './lib/statuses';

const url = process.env.PUBLIC_URL || 'http://localhost:9000';
export const submitWord = async (word: string): Promise<CharStatus[]> => {
  console.log(url);
  const result = await fetch(`${url}/submit`, {
    method: 'POST',
    body: JSON.stringify({ word }),
    headers: { 'Content-Type': 'application/json' },
  });
  return await result.json();
};
