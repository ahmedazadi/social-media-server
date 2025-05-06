import { Router } from "express";
import authRouter from "./auth/auth.route";
import postRouter from "./post/post.route";
import userRouter from "./user/user.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/post", postRouter);
router.use("/user", userRouter);

export default router;
