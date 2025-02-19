import express, { Application } from 'express';
import bodyParser from 'body-parser';
import pino from 'pino';
import PinoHttp from 'pino-http';
import universalRouter from './routes';
import authRoutes from './routes/authRoutes';

export const logger = pino({
  level: 'debug',
});

const app: Application = express();

app.use(PinoHttp({ logger }));
app.use(bodyParser.json());

app.use('/auth', authRoutes);

app.use('/api', universalRouter);

export default app;