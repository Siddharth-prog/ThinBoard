import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  _id: { type: String, unique: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('Room', roomSchema);
