import db from "@/shared/config/prisma";
import { randomUUID } from "crypto";

export async function createComment(
  content: string,
  postId: string,
  userId: string
) {
  const [comment]: any = await db.$queryRaw`
    INSERT INTO "Comment" ("id", "content", "post_id", "user_id", "createdAt", "updatedAt")
    VALUES (${randomUUID()}, ${content}, ${postId}, ${userId}, NOW(), NOW())
    RETURNING *
  `;

  return comment;
}

export async function getCommentsByPostId(postId: string) {
  const comments: any[] = await db.$queryRaw`
    SELECT 
      c.*, 
      u."id" as "userId", 
      u."username", 
      pr."profile_picture"
    FROM "Comment" c
    JOIN "User" u ON u."id" = c."user_id"
    LEFT JOIN "Profile" pr ON pr."id" = u."id"
    WHERE c."post_id" = ${postId}
    ORDER BY c."createdAt" ASC
  `;

  return comments;
}

export async function deleteComment(commentId: string, userId: string) {
  const [comment]: any = await db.$queryRaw`
    DELETE FROM "Comment"
    WHERE "id" = ${commentId} AND "user_id" = ${userId}
    RETURNING *
  `;

  return comment;
}

export async function updateComment(
  commentId: string,
  content: string,
  userId: string
) {
  const [comment]: any = await db.$queryRaw`
    UPDATE "Comment"
    SET "content" = ${content}, "updatedAt" = NOW()
    WHERE "id" = ${commentId} AND "user_id" = ${userId}
    RETURNING *
  `;

  return comment;
}
