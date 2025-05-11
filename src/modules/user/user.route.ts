import { Router } from "express";
import * as userController from "./user.controller";
import { authenticateToken } from "@/shared/middleware/auth.middleware";

const router = Router();

// follow user
router.post("/follow/:userId", authenticateToken, userController.followUser);

// unfollow user
router.post(
  "/unfollow/:userId",
  authenticateToken,
  userController.unfollowUser
);

// get followers
router.get(
  "/followers/:userId",
  authenticateToken,
  userController.getFollowers
);

// get followings
router.get(
  "/followings/:userId",
  authenticateToken,
  userController.getFollowing
);

// post profile
router.post("/profile", authenticateToken, userController.postProfile);

// get user profile
router.get("/profile", authenticateToken, userController.getProfile);

// edit user profiel
router.put("/profile", authenticateToken, userController.putProfile);

export default router;
