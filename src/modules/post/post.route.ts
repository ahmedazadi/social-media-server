import { Router } from "express";
import * as postControllers from "./post.controller";
import { authenticateToken } from "@/shared/middleware/auth.middleware";

const router = Router();

// post to create a new post
router.post("/", authenticateToken, postControllers.postPost);

// delete post
router.delete("/:postId", authenticateToken, postControllers.deletePost);

// get posts by author
router.get(
  "/by-author/:authorId",
  authenticateToken,
  postControllers.getPostsByAuthor
);

// get posts from friends
router.get(
  "/from-following",
  authenticateToken,
  postControllers.getPostsFromFollowing
);

export default router;
