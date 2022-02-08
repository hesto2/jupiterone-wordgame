import { CharStatus } from './lib/statuses';

const url =
  process.env.PUBLIC_URL ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:9000';
export const submitWord = async (word: string): Promise<CharStatus[]> => {
  console.log(url);
  const result = await fetch(`${url}/submit`, {
    method: 'POST',
    body: JSON.stringify({ word }),
    headers: { 'Content-Type': 'application/json' },
  });
  return await result.json();
};
export const getWordID = async (): Promise<{ id: number }> => {
  const result = await fetch(`${url}/wordId`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return await result.json();
};
