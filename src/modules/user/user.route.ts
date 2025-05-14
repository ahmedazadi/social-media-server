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

// get user profile
router.get("/profile/:id", authenticateToken, userController.getTheirProfile);

// get user profile
router.get("/profile", authenticateToken, userController.getProfile);

// post profile
router.post("/profile", authenticateToken, userController.postProfile);

// edit user profiel
router.put("/profile", authenticateToken, userController.putProfile);

export default router;
