import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { useCommonMiddleware, useNotFoundHandler } from '@hesto2/express-utils';
import { authenticate } from './auth';
import { getGuessStatuses } from './lib';
import { getTodayWord, updateWords, getAllWords } from './dao';

const getApp = () => {
  const app = express();

  useCommonMiddleware(app);

  app.use(express.static('public'));

  // error handler
  app.use((err: any, _req: any, res: any, next: any) => {
    if (res.headersSent) {
      return next(err);
    }
    console.error(err);
    if (err.isAxiosError) {
      res.status(err.response.status).json(err.response.data);
    }
    next(err);
  });
  app.post('/submit', async (req, res) => {
    const body: { word: string } = req.body;
    const todayWord = await getTodayWord();
    const statuses = getGuessStatuses(body.word, todayWord);
    return res.status(200).json(statuses);
  });

  app.get('/word', authenticate, async (req, res) => {
    const word = await getTodayWord();
    return res.status(200).json(word);
  });
  app.get('/words', authenticate, async (req, res) => {
    const words = await getAllWords();
    return res.status(200).json(words);
  });
  app.put('/words', authenticate, async (req, res) => {
    const words = await updateWords(req.body.words);
    return res.status(200).json(words);
  });

  app.use((req: Request, res: Response) => {
    res.sendFile('index.html', { root: './public/' }, (err) => {
      res.end();
      if (err) {
        throw err;
      }
    });
  });
  return app;
};

export default getApp;
