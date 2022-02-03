import express, { Request, Response } from 'express';
import { useCommonMiddleware, useNotFoundHandler } from '@hesto2/express-utils';

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
