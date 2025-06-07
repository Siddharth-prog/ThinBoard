import mongoose from 'mongoose';
const { Schema } = mongoose;

const RoomSchema = new Schema({
  roomId: { type: String, required: true, unique: true },  // ✅ index ensures uniqueness
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model('Room', RoomSchema);
