import mongoose from 'mongoose';

const DrawingSchema = new mongoose.Schema({
  roomId: String,
  data: Object,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Drawing', DrawingSchema);