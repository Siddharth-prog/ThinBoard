import Room from '../models/Room.js';
import User from '../models/User.js';

/**
 * Generates a unique 6-character room ID
 */
const generateUniqueRoomId = () => {
  return Math.random().toString(36).substring(2, 8);
};

/**
 * Handles all socket events
 */
export const registerSocketEvents = (io, socket) => {
  console.log(`🔌 New socket connected: ${socket.id}`);

  // Set username and avatar
  socket.on('set-username', async ({ username, avatar }) => {
    let existingUser = await User.findOne({ socketId: socket.id });

    if (!existingUser) {
      const user = new User({ socketId: socket.id, username, avatar });
      await user.save();
    } else {
      existingUser.username = username;
      existingUser.avatar = avatar;
      await existingUser.save();
    }

    console.log(`🧑 Username set for ${socket.id}: ${username}`);
  });

  // Create a new room
  socket.on('create-room', async ({ username, avatar }, callback) => {
    const roomId = generateUniqueRoomId();

    const newRoom = new Room({ _id: roomId, users: [] }); // <-- Use _id here
    await newRoom.save();

    const user = new User({ socketId: socket.id, username, avatar, roomId });
    await user.save();

    newRoom.users.push(user._id);
    await newRoom.save();

    socket.join(roomId);
    io.to(roomId).emit('user-list', await User.find({ roomId }));

    console.log(`📦 Room created: ${roomId}`);
    callback({ success: true, roomId });
  });

  // Join an existing room
  socket.on('join-room', async ({ roomId, username, avatar }, callback) => {
    const room = await Room.findById(roomId); // <-- Use findById

    if (!room) {
      return callback({ error: 'Room not found' });
    }

    const user = new User({ socketId: socket.id, username, avatar, roomId });
    await user.save();

    room.users.push(user._id);
    await room.save();

    socket.join(roomId);
    io.to(roomId).emit('user-list', await User.find({ roomId }));

    console.log(`➡️ ${username} joined room: ${roomId}`);
    callback({ success: true });
  });

  // Drawing event
  socket.on('drawing', ({ roomId, data }) => {
    socket.to(roomId).emit('drawing', data);
  });

  // Chat event
  socket.on('chat-message', async ({ roomId, message }) => {
    const user = await User.findOne({ socketId: socket.id });
    if (!user) return;

    io.to(roomId).emit('chat-message', {
      sender: user.username,
      avatar: user.avatar,
      message,
      timestamp: new Date()
    });
  });

  // Disconnect event
  socket.on('disconnect', async () => {
    const user = await User.findOne({ socketId: socket.id });
    if (!user) return;

    const roomId = user.roomId;
    if (roomId) {
      const room = await Room.findById(roomId); // Use _id directly
      if (room) {
        room.users = room.users.filter(uid => uid.toString() !== user._id.toString());
        await room.save();
      }

      await User.deleteOne({ socketId: socket.id });

      const remainingUsers = await User.find({ roomId });
      io.to(roomId).emit('user-list', remainingUsers);
    }

    console.log(`❌ User disconnected: ${socket.id}`);
  });
};
