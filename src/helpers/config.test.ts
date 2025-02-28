import config from './config';

describe('Config Module', () => {
  afterEach(() => {
    delete process.env.MONGODB_CONNECTION_URL;
    jest.resetModules();
  });

  it('should return the default MongoDB connection URL if environment variable is not set', () => {
    expect(config.mongoDB.connectionUrl).toBe('mongodb://localhost/blogDB');
  });

  it('should return the MongoDB connection URL from the environment variable if set', () => {
    process.env.MONGODB_CONNECTION_URL = 'mongodb://custom-url:27017/testDB';
    jest.resetModules();
    // eslint-disable-next-line global-require
    const updatedConfig = require('./config').default;
    expect(updatedConfig.mongoDB.connectionUrl).toBe('mongodb://custom-url:27017/testDB');
  });
});
