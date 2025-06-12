import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import roomRoutes from './routes/roomRoutes.js';
import { registerSocketEvents } from './sockets/socketHandlers.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use('/api/rooms', roomRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const userSessions = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  registerSocketEvents(io, socket, userSessions);
});

server.listen(process.env.PORT || 8000, () => {
  console.log(`Server running on port ${process.env.PORT || 8000}`);
});
