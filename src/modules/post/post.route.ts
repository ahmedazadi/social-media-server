import { Router } from "express";
import * as postControllers from "./post.controller";
import { authenticateToken } from "@/shared/middleware/auth.middleware";

const router = Router();

// get posts from friends
router.get(
  "/from-following",
  authenticateToken,
  postControllers.getPostsFromFollowing
);

export default router;
