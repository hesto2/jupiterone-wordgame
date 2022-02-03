const Bucket = process.env.S3_BUCKET;
const Key = 'words.txt';

export const getTodayWord = async (): Promise<string> => {
  return 'test';
};
export const getAllWords = async (): Promise<string[]> => {
  return ['test'];
};
export const updateWords = async (newWords: string): Promise<string[]> => {
  return ['test'];
};
