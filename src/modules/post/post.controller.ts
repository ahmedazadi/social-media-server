import { Request, Response } from "express";
import * as postService from "./post.service";
import db from "@/shared/config/prisma";

export async function postPost(req: Request, res: Response) {
  const { content, image } = req.body;

  if (!content) {
    res.status(400).json({ error: "Content is required" });
    return;
  }

  const user = (req as any).user;

  try {
    const post = await postService.createPost(content, image, user.id);
    res.status(200).json({ data: post });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to create post" });
    return;
  }
}

export async function deletePost(req: Request, res: Response) {
  const user = (req as any).user;
  const postId = req.params.postId;

  try {
    await postService.deletePost(postId, user.id);
    res.status(200).json({ data: "Post deleted successfully" });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to delete post" });
    return;
  }
}

export async function getPostsByAuthor(req: Request, res: Response) {
  const user = (req as any).user;
  const authorId = req.params.authorId;
  const result = await postService.getPostsByAuthor(authorId, user);
  res.status(200).json({ data: result });
  return;
}

export async function getPostsFromFollowing(req: Request, res: Response) {
  console.log("getPostsFromFollowing");
  const user = (req as any).user;

  try {
    const data = await postService.getPostsFromFollowing(user.id);

    res.status(200).json({ data });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to get posts from following" });
    return;
  }
}

export async function getPostById(req: Request, res: Response) {
  const postId = req.params.postId;
  const user = (req as any).user;

  try {
    const post = await postService.getPostById(postId, user);
    res.status(200).json({ data: post });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to get post" });
    return;
  }
}

export async function likePost(req: Request, res: Response) {
  const user = (req as any).user;
  const postId = req.params.postId;

  try {
    await postService.likePost(postId, user.id);
    res.status(200).json({ message: "Post liked successfully" });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to like post" });
    return;
  }
}

export async function unlikePost(req: Request, res: Response) {
  const user = (req as any).user;
  const postId = req.params.postId;

  try {
    await postService.unlikePost(postId, user.id);
    res.status(200).json({ message: "Post unliked successfully" });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to unlike post" });
    return;
  }
}

export async function getAllPosts(req: Request, res: Response) {
  const user = (req as any).user;
  const result = await postService.getAllPosts(user.id);
  res.status(200).json({ data: result });
  return;
}
