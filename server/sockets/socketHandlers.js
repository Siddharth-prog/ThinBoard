import Room from '../models/Room.js';
import User from '../models/User.js';

const generateUniqueRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const registerSocketEvents = (io, socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('set-username', async ({ username, avatar }) => {
    let user = await User.findOne({ socketId: socket.id });
    if (!user) {
      user = new User({ socketId: socket.id, username, avatar });
    } else {
      user.username = username;
      user.avatar = avatar;
    }
    await user.save();
  });

  socket.on('create-room', async ({ username, avatar }, callback) => {
    try {
      const roomId = generateUniqueRoomId();

      const room = new Room({ roomId });
      await room.save();

      const user = new User({ socketId: socket.id, username, avatar, roomId });
      await user.save();

      room.users.push(user._id);
      await room.save();

      socket.join(roomId);

      const users = await User.find({ roomId });
      io.to(roomId).emit('user-list', users);

      callback({ success: true, roomId });
    } catch (err) {
      console.error(err);
      callback({ error: 'Room creation failed' });
    }
  });

  socket.on('join-room', async ({ roomId, username, avatar }, callback) => {
    try {
      roomId = roomId.trim().toUpperCase();
      const room = await Room.findOne({ roomId });
      if (!room) return callback({ error: 'Room not found' });

      const user = new User({ socketId: socket.id, username, avatar, roomId });
      await user.save();

      room.users.push(user._id);
      await room.save();

      socket.join(roomId);

      const users = await User.find({ roomId });
      io.to(roomId).emit('user-list', users);

      callback({ success: true, roomId });
    } catch (err) {
      console.error(err);
      callback({ error: 'Join room failed' });
    }
  });

  socket.on('drawing', async ({ roomId, ...data }) => {
    socket.to(roomId).emit('drawing', data);
  });

  socket.on('chat-message', async ({ roomId, message }) => {
    const user = await User.findOne({ socketId: socket.id });
    if (!user) return;

    const payload = {
      sender: user.username,
      avatar: user.avatar,
      message,
      timestamp: new Date(),
    };

    io.to(roomId).emit('chat-message', payload);
  });

  socket.on('leave-room', async ({ roomId }) => {
    const user = await User.findOne({ socketId: socket.id });
    if (!user) return;

    await Room.findOneAndUpdate({ roomId }, { $pull: { users: user._id } });
    await User.deleteOne({ socketId: socket.id });

    socket.leave(roomId);

    const users = await User.find({ roomId });
    io.to(roomId).emit('user-list', users);
  });

  socket.on('disconnect', async () => {
    try {
      const user = await User.findOne({ socketId: socket.id });
      if (!user) return;

      const roomId = user.roomId;

      await Room.findOneAndUpdate({ roomId }, { $pull: { users: user._id } });
      await User.deleteOne({ socketId: socket.id });

      const users = await User.find({ roomId });
      io.to(roomId).emit('user-list', users);

      console.log(`❌ Disconnected: ${socket.id}`);
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  });
};
