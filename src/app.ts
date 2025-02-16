import express from 'express'
import bodyParser from "body-parser";
import pino from 'pino';
import PinoHttp from 'pino-http';
import universalRouter from './routes';

export const logger = pino({
    level: 'debug',
  });
  
const app = express()

app.use(PinoHttp({ logger }));

app.use(bodyParser.json())

app.use('/api', universalRouter)

export default app