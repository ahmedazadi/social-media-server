import { Request, Response } from "express";
import * as postService from "./post.service";
import db from "@/shared/config/prisma";

export async function postPost(req: Request, res: Response) {
  const { content } = req.body;

  if (!content) {
    res.status(400).json({ error: "Content is required" });
    return;
  }

  const user = (req as any).user;

  const post = await postService.createPost(content, user.id);

  res.status(200).json({ data: post });
  return;
}

export async function deletePost(req: Request, res: Response) {
  const user = (req as any).user;
  const postId = req.params.postId;

  const result = await db.post.delete({
    where: {
      id: postId,
      author_id: user.id,
    },
  });

  res.status(200).json({ data: result });
}

export async function getPostsByAuthor(req: Request, res: Response) {
  const authorId = req.params.authorId;
  const result = await postService.getPostsByAuthor(authorId);
  res.status(200).json({ data: result });
}

export async function getPostsFromFollowing(req: Request, res: Response) {
  const user = (req as any).user;

  const data = await postService.getPostsFromFollowing(user.id);

  res.status(200).json({ data });
  return;
}
export async function getPostById(req: Request, res: Response) {
  const postId = req.params.postId;

  const post = await postService.getPostById(postId);

  res.status(200).json({ data: post });
}
