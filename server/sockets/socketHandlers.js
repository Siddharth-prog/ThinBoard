import Room from '../models/Room.js';
import User from '../models/User.js';

const generateUniqueRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const registerSocketEvents = (io, socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('create-room', async ({ username, avatar }, callback) => {
    try {
      const roomId = generateUniqueRoomId();
      console.log(`🛠️ Creating room: ${roomId} for user ${username}`);

      const room = new Room({ roomId });
      await room.save();

      const user = new User({ socketId: socket.id, username, avatar, roomId });
      await user.save();

      room.users.push(user._id);
      await room.save();

      socket.join(roomId);
      socket.roomId = roomId;

      const users = await User.find({ roomId });
      io.to(roomId).emit('user-list', users);

      console.log(`✅ Room ${roomId} created and joined by ${username}`);

      callback({ success: true, roomId });
    } catch (err) {
      console.error('❌ Room creation error:', err);
      callback({ error: 'Room creation failed' });
    }
  });

  socket.on('join-room', async ({ username, avatar, roomId }, callback) => {
    try {
      roomId = roomId.trim().toUpperCase();
      const room = await Room.findOne({ roomId });
  
      if (!room) {
        return callback({ error: 'Room not found' });
      }
  
      // Check if user with this socketId already exists to avoid duplicates
      let user = await User.findOne({ socketId: socket.id });
  
      if (!user) {
        user = new User({ socketId: socket.id, username, avatar, roomId });
        await user.save();
      }
  
      // Only add user._id if not already in room.users
      if (!room.users.some(id => id.equals(user._id))) {
        room.users.push(user._id);
        await room.save();
      }
      
  
      socket.join(roomId);
      socket.roomId = roomId;
  
      const users = await User.find({ roomId });
      io.to(roomId).emit('user-list', users);
  
      callback({ success: true, roomId });
    } catch (err) {
      console.error('Join room error:', err);
      callback({ error: 'Join room failed' });
    }
  });
  

  
  socket.on('drawing', ({ roomId, ...data }) => {
    if (!roomId) {
      console.warn(`⚠️ Drawing event received without roomId from ${socket.id}`);
      return;
    }
    console.log(`🖌️ Drawing event in room ${roomId} from ${socket.id}`);
    socket.to(roomId).emit('drawing', data);
  });

  socket.on('chat-message', async ({ roomId, message }) => {
    try {
      const user = await User.findOne({ socketId: socket.id });
      if (!user || !roomId) {
        console.warn(`⚠️ Chat message rejected - missing user or roomId`);
        return;
      }

      const payload = {
        sender: user.username,
        avatar: user.avatar,
        message,
        timestamp: new Date(),
      };

      console.log(`💬 Chat from ${user.username} in room ${roomId}: ${message}`);
      io.to(roomId).emit('chat-message', payload);
    } catch (err) {
      console.error('❌ Chat error:', err);
    }
  });

  socket.on('leave-room', async ({ roomId, userId }) => {
    try {
      if (!roomId || !userId) return;
  
      // Remove user from User collection
      await User.deleteOne({ _id: userId });
  
      // Remove user from the Room's users array
      await Room.updateOne(
        { roomId },
        { $pull: { users: userId } }
      );
  
      // Make socket leave the Socket.IO room
      socket.leave(roomId);
  
      // Emit updated user list to all in the room
      const users = await User.find({ roomId });
      io.to(roomId).emit('user-list', users);
  
      console.log(`User ${userId} left room ${roomId}`);
    } catch (err) {
      console.error('Error in leave-room handler:', err);
    }
  });
  
  socket.on('disconnect', async () => {
    try {
      const socketId = socket.id;
  
      // Find the user with this socketId
      const user = await User.findOne({ socketId });
      if (!user) return; // User already removed?
  
      const roomId = user.roomId;
      const userId = user._id;
  
      // Delete the user document
      await User.deleteOne({ _id: userId });
  
      // Remove user from the Room's users array
      await Room.updateOne(
        { roomId },
        { $pull: { users: userId } }
      );
  
      // Emit updated user list to the room
      const users = await User.find({ roomId });
      io.to(roomId).emit('user-list', users);
  
      console.log(`User ${user.username} disconnected and removed from room ${roomId}`);
    } catch (err) {
      console.error('Error in disconnect handler:', err);
    }
  });
  
  
};
