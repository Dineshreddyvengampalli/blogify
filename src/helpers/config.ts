const config = {
  mongoDB: {
    connectionUrl: process.env.MONGODB_CONNECTION_URL || 'mongodb://localhost/blogDB',
  },
};

export default config;
