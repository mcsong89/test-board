// src/routes/commentRoutes.ts
import express from "express";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController";

const router = express.Router();

router.get("/:postId", getComments);
router.post("/:postId", createComment);
router.put("/:commentId", updateComment);
router.delete("/:id", deleteComment);

export default router;
