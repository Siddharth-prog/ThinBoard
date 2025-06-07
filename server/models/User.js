import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  socketId: {type:String , unique: true},
  username: String,
  avatar: String,
  roomId: String,
});

export default mongoose.model('User', userSchema);
