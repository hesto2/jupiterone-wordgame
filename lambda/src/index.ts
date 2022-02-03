import awsServerlessExpress from 'aws-serverless-express';
import getApp from './app';
import { APIGatewayEvent, Context } from 'aws-lambda';

const app = getApp();
const server = awsServerlessExpress.createServer(app);

export const handler = (event: APIGatewayEvent, context: Context) =>
  awsServerlessExpress.proxy(server, event, context);
