import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { useCommonMiddleware } from '@hesto2/express-utils';
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
    try {
      const body = req.body;
      const todayWord = await getTodayWord();
      const statuses = getGuessStatuses(body.word, todayWord);
      return res.status(200).json(statuses);
    } catch (err) {
      return res.status(500).send(err);
    }
  });

  app.get('/word', authenticate, async (req, res) => {
    try {
      const word = await getTodayWord();
      return res.status(200).json(word);
    } catch (err) {
      return res.status(500).send(err);
    }
  });
  app.get('/words', authenticate, async (req, res) => {
    try {
      const words = await getAllWords();
      return res.status(200).json(words);
    } catch (err) {
      return res.status(500).send(err);
    }
  });

  // Expects an array of strings
  app.put('/words', authenticate, async (req, res) => {
    try {
      const words = await updateWords(req.body);
      return res.status(200).json(words);
    } catch (err) {
      return res.status(500).send(err);
    }
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
