import { Request, Response } from "express";
import { createPost } from "./post.service";

export async function postPost(req: Request, res: Response) {
  const { content } = req.body;

  if (!content) {
    res.status(400).json({ error: "Content is required" });
    return;
  }

  const user = (req as any).user;

  const post = await createPost(content, user.id);

  res.status(200).json(post);
  return;
}

export async function getPostsFromFollowing(req: Request, res: Response) {
  const user = (req as any).user;

  res.status(200).json({
    message: "Get posts from friends",
    user,
  });
  return;
}
