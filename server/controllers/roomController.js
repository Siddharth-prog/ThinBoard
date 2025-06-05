import Room from '../models/Room.js';
import Drawing from '../models/Drawing.js';
import { v4 as uuidv4 } from 'uuid';
const WORDS = ['tree', 'house', 'car', 'sun', 'dog'];
const GAME_DURATION = 180;
const activeTimers = new Map();

export const createRoom = async (socket, userSessions, callback) => {
  if (typeof callback !== 'function') {
    console.error('Missing callback for create-room');
    return;
  }

  try {
    const user = userSessions.get(socket.id);
    if (!user) {
      return callback({ error: 'Please set username first' });
    }

    const roomId = uuidv4();

    const room = new Room({
      roomId,
      users: [{ username: user.username, avatar: user.avatar }],
      createdAt: new Date(),
    });

    await room.save();
    socket.join(roomId);
    socket.roomId = roomId;

    console.log(`Room created: ${roomId} by ${user.username}`);
    callback({ roomId });
  } catch (error) {
    console.error('Room creation error:', error);
    callback({ error: 'Failed to create room' });
  }
};

  

export const joinRoom = async (socket, userSessions, io, roomId, callback) => {
  const user = userSessions.get(socket.id);
  if (!user) return callback({ error: 'Please set username first' });

  const room = await Room.findOne({ roomId });
  if (!room) return callback({ error: 'Room not found' });

  if (room.users.some(u => u.username === user.username)) {
    return callback({ error: 'Username already taken in this room' });
  }

  room.users.push({ username: user.username, avatar: user.avatar });
  await room.save();

  socket.join(roomId);
  socket.roomId = roomId;

  io.to(roomId).emit('user-list', room.users);

  if (room.users.length === 1) startGame(roomId, io);

  callback({ roomId });
};

export const handleDrawing = async (socket, data, roomId, io) => {
  if (!roomId) return;
  socket.to(roomId).emit('drawing', data);
  await Drawing.create({ roomId, data, timestamp: new Date() });
};

export const handleDisconnect = async (socket, userSessions, io) => {
  const user = userSessions.get(socket.id);
  if (!user) return;

  const roomId = socket.roomId;
  userSessions.delete(socket.id);

  if (roomId) {
    const room = await Room.findOne({ roomId });
    if (room) {
      room.users = room.users.filter(u => u.username !== user.username);
      await room.save();

      io.to(roomId).emit('user-list', room.users);

      if (room.users.length === 0) {
        clearTimer(roomId);
        await Room.deleteOne({ roomId });
      }
    }
  }
};

const startGame = (roomId, io) => {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  io.to(roomId).emit('assign-word', word);

  let timeLeft = GAME_DURATION;
  io.to(roomId).emit('start-timer', timeLeft);

  const timer = setInterval(() => {
    timeLeft--;
    io.to(roomId).emit('start-timer', timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timer);
      activeTimers.delete(roomId);
    }
  }, 1000);

  activeTimers.set(roomId, timer);
};

const clearTimer = (roomId) => {
  if (activeTimers.has(roomId)) {
    clearInterval(activeTimers.get(roomId));
    activeTimers.delete(roomId);
  }
};
