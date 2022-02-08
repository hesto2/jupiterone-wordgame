const Bucket = 'jupiterone-wordle-data';
const Key = 'words.txt';
import { S3, WorkDocs } from 'aws-sdk';
const s3 = new S3();
const epoch = 'February 1, 2022 00:00:00';

const getTodayIndex = (words: string[]): number => {
  // Copied from UI repo that I cloned
  // February 1, 2022 Game Epoch
  const epochMs = new Date(epoch).valueOf();
  const now = Date.now();
  const msInDay = 86400000;
  const index = Math.floor((now - epochMs) / msInDay);
  return index % words.length;
};

export const getTodayWord = async (): Promise<string> => {
  const words = await getAllWords();
  const index = getTodayIndex(words);
  return words[index].toUpperCase() || '';
};
export const getTodayID = async (): Promise<number> => {
  const words = await getAllWords();
  const index = getTodayIndex(words);
  return index;
};
export const getAllWords = async (): Promise<string[]> => {
  const result = await s3.getObject({ Bucket, Key }).promise();
  const body = result.Body.toString();
  return JSON.parse(body);
};
export const updateWords = async (newWords: string[]): Promise<string[]> => {
  await s3.putObject({ Bucket, Key, Body: JSON.stringify(newWords) }).promise();
  return newWords;
};
