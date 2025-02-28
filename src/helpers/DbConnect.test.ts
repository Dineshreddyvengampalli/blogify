import mongoose from 'mongoose';
import connectToDb from './DbConnect';
import { logger } from '../app';

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn(() => Promise.resolve()),
    connection: {
      on: jest.fn(),
      readyState: 0,
    },
  };
});

jest.mock('./config', () => ({
  mongoDB: {
    connectionUrl: 'mongodb://localhost/testDB',
  },
}));

jest.mock('../app', () => ({
  logger: {
    info: jest.fn(),
  },
}));

describe('Database Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to MongoDB if disconnected', async () => {
    await connectToDb();
    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost/testDB');
    expect(logger.info).toHaveBeenCalledWith('✅ MongoDB Connected!');
  });
});
