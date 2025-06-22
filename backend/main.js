import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import mongoose from 'mongoose';

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('joinUser', (userId) => socket.join(userId));
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// ✅ Graceful shutdown handler
const gracefulShutdown = async () => {
  console.log('\nShutting down gracefully...');
  io.close(() => {
    console.log('Socket.IO closed');
  });
  await mongoose.disconnect();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);  // Ctrl+C locally
process.on('SIGTERM', gracefulShutdown); // Render, Docker stop