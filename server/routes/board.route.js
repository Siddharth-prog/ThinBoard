import express from "express";
import { getUserBoards } from "../controllers/board.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/v1/board/ — get all boards for the logged-in user
router.get("/user", protect, getUserBoards);

export default router;
