import { Request, Response } from "express";
import { createPost } from "./post.service";
import db from "@/shared/config/prisma";

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

export async function deletePost(req: Request, res: Response) {
  const user = (req as any).user;
  const postId = req.params.postId;

  const result = await db.post.delete({
    where: {
      id: postId,
      author_id: user.id,
    },
  });

  res.status(200).json(result);
}

export async function getPostsByAuthor(req: Request, res: Response) {
  const authorId = req.params.authorId;

  const result = await db.post.findMany({
    where: {
      author_id: authorId,
    },
  });

  res.status(200).json(result);
}

export async function getPostsFromFollowing(req: Request, res: Response) {
  const user = (req as any).user;

  const followedIds = await db.following.findMany({
    select: {
      followedId: true,
    },
    where: {
      followerId: user.id,
    },
  });

  const followedPosts = await db.post.findMany({
    where: {
      author_id: { in: followedIds.map((item) => item.followedId) },
    },
  });

  res.status(200).json(followedPosts);
  return;
}
