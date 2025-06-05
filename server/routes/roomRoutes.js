import express from 'express';
import Room from '../models/Room.js';

const router = express.Router();

router.get('/:roomId', async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
