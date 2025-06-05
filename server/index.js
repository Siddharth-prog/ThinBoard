import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import roomRoutes from './routes/roomRoutes.js';
import { registerSocketEvents } from './sockets/socketHandlers.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5174',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use('/api/rooms', roomRoutes);

mongoose.connect('mongodb://localhost:27017/whiteboard')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const userSessions = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  registerSocketEvents(io, socket, userSessions);
});

server.listen(8000, () => {
  console.log('Server running on port 8000');
});
