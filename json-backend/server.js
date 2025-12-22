// json-backend/server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cors = require('cors');

// Enable CORS for all origins
server.use(cors());

// Use default middlewares
server.use(middlewares);

// Add delay to simulate real API (optional)
server.use((req, res, next) => {
  setTimeout(next, 100); // 100ms delay
});

// Use router
server.use(router);

// Start server
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});