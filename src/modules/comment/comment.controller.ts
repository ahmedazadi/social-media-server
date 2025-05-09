import { Request, Response } from "express";
import * as commentService from "./comment.service";

export async function createComment(req: Request, res: Response) {
  const { content, postId } = req.body;
  const user = (req as any).user;

  const comment = await commentService.createComment(content, postId, user.id);
  if (!comment) {
    res.status(400).json({ message: "Failed to create comment" });
    return;
  }

  res.status(200).json({ data: comment });
  return;
}

export async function getCommentsByPostId(req: Request, res: Response) {
  const { postId } = req.params;

  const comments = await commentService.getCommentsByPostId(postId);
  if (!comments.length) {
    res.status(400).json({ message: "Failed to get comments" });
    return;
  }

  res.status(200).json({ data: comments });
  return;
}

export async function deleteComment(req: Request, res: Response) {
  const { commentId } = req.params;
  const user = (req as any).user;

  const comment = await commentService.deleteComment(commentId, user.id);

  if (!comment) {
    res.status(400).json({ message: "Failed to delete comment" });
    return;
  }

  res
    .status(200)
    .json({ message: "Comment deleted successfully", data: comment });
  return;
}

export async function updateComment(req: Request, res: Response) {
  const { commentId } = req.params;
  const { content } = req.body;
  const user = (req as any).user;

  const comment = await commentService.updateComment(
    commentId,
    content,
    user.id
  );
  if (!comment) {
    res.status(400).json({ message: "Failed to update comment" });
    return;
  }

  res
    .status(200)
    .json({ message: "Comment updated successfully", data: comment });
  return;
}
