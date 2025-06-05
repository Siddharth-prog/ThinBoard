import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  socketId: String,
  username: String,
  avatar: String,
  roomId: String,
});

export default mongoose.model('User', userSchema);
