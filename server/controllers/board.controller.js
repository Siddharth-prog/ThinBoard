import { Board } from "../models/board.model.js";

export const getUserBoards = async (req, res) => {
  try {
    const userId = req.user._id;

    const boards = await Board.find({ participants: userId }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      boards,
    });
  } catch (error) {
    console.error("Failed to fetch boards:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch boards",
    });
  }
};
