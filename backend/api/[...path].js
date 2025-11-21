const serverless = require('serverless-http');
const app = require('../app');

const handler = serverless(app);

module.exports = async (req, res) => {
  if (req.url.startsWith('/api')) {
    req.url = req.url.replace(/^\/api/, '') || '/';
  }
  return handler(req, res);
};