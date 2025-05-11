import { Router } from "express";
import * as postControllers from "./post.controller";
import { authenticateToken } from "@/shared/middleware/auth.middleware";

const router = Router();

// post to create a new post
router.post("/", authenticateToken, postControllers.postPost);

// get posts from friends
router.get(
  "/from-following",
  authenticateToken,
  postControllers.getPostsFromFollowing
);

// get all posts
router.get("/all", authenticateToken, postControllers.getAllPosts);

// get post by id
router.get("/:postId", authenticateToken, postControllers.getPostById);

// delete post
router.delete("/:postId", authenticateToken, postControllers.deletePost);

// like post
router.post("/:postId/like", authenticateToken, postControllers.likePost);

// unlike post
router.post("/:postId/unlike", authenticateToken, postControllers.unlikePost);

// get posts by author
router.get(
  "/by-author/:authorId",
  authenticateToken,
  postControllers.getPostsByAuthor
);

export default router;
