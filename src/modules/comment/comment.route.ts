import { Router } from "express";
import { authenticateToken } from "@/shared/middleware/auth.middleware";
import * as commentControllers from "./comment.controller";

const router = Router();

router.post("/:postId", authenticateToken, commentControllers.createComment);
router.get(
  "/:postId",
  authenticateToken,
  commentControllers.getCommentsByPostId
);
router.delete(
  "/:commentId",
  authenticateToken,
  commentControllers.deleteComment
);
router.put("/:commentId", authenticateToken, commentControllers.updateComment);

export default router;
