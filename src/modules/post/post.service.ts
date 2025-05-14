import db from "@/shared/config/prisma";
import { randomUUID } from "crypto";

// Create a post
export async function createPost(
  content: string,
  image: string,
  author_id: string
) {
  const [post]: any = await db.$queryRaw`
    INSERT INTO "Post" (
      "id", "content", "PostImage", "author_id", "createdAt", "updatedAt", "publicity"
    ) VALUES (
      ${randomUUID()}, ${content}, ${image}, ${author_id}, NOW(), NOW(), 1
    )
    RETURNING *
  `;
  return post;
}

// Get post by ID including author info, like count, comment count, and whether user liked it
export async function getPostById(id: string, userId: string) {
  const [post]: any = await db.$queryRaw`
    SELECT 
      p.*,
      u."id" as "authorId",
      u."username",
      pr."display_name",
      pr."profile_picture",
      COUNT(DISTINCT pl."post_id") AS "likeCount",
      COUNT(DISTINCT c."id") AS "commentCount",
      EXISTS (
        SELECT 1 FROM "PostLiked"
        WHERE "post_id" = p."id" AND "author_id" = ${userId}
      ) AS "likedByCurrentUser"
    FROM "Post" p
    JOIN "User" u ON u."id" = p."author_id"
    LEFT JOIN "Profile" pr ON pr."id" = u."id"
    LEFT JOIN "PostLiked" pl ON pl."post_id" = p."id"
    LEFT JOIN "Comment" c ON c."post_id" = p."id"
    WHERE p."id" = ${id}
    GROUP BY p."id", u."id", pr."display_name", pr."profile_picture"
  `;

  if (post) {
    post.likeCount = Number(post.likeCount);
    post.commentCount = Number(post.commentCount);
    post.likedByCurrentUser = Boolean(post.likedByCurrentUser);
  }

  return post;
}

// Get all posts by a specific author including author info and like/comment counts
export async function getPostsByAuthor(author_id: string, userId: string) {
  console.log("userId:", typeof userId, userId);
  console.log("author_id:", typeof author_id, author_id);

  const posts: any[] = await db.$queryRawUnsafe(
    `
    SELECT 
      p.*,
      u."id" as "authorId",
      u."username",
      pr."display_name",
      pr."profile_picture",
      COALESCE(l."likeCount", 0) AS "likeCount",
      COALESCE(c."commentCount", 0) AS "commentCount",
      EXISTS (
        SELECT 1 FROM "PostLiked"
        WHERE "post_id" = p."id" AND "author_id" = $1
      ) AS "likedByCurrentUser"
    FROM "Post" p
    JOIN "User" u ON u."id" = p."author_id"
    LEFT JOIN "Profile" pr ON pr."id" = u."id"
    LEFT JOIN (
      SELECT "post_id", COUNT(*) AS "likeCount"
      FROM "PostLiked"
      GROUP BY "post_id"
    ) l ON l."post_id" = p."id"
    LEFT JOIN (
      SELECT "post_id", COUNT(*) AS "commentCount"
      FROM "Comment"
      GROUP BY "post_id"
    ) c ON c."post_id" = p."id"
    WHERE p."author_id" = $2
    ORDER BY p."createdAt" DESC
  `,
    userId,
    author_id
  ); // Note the order of params

  return posts.map((post) => ({
    ...post,
    likeCount: Number(post.likeCount),
    commentCount: Number(post.commentCount),
    likedByCurrentUser: Boolean(post.likedByCurrentUser),
  }));
}

// Delete a post only if the user is the author
export async function deletePost(postId: string, userId: string) {
  const [post]: any = await db.$queryRaw`
    DELETE FROM "Post"
    WHERE "id" = ${postId} AND "author_id" = ${userId}
    RETURNING *
  `;
  return post;
}

export async function getPostsFromFollowing(userId: string) {
  const posts: any[] = await db.$queryRaw`
    SELECT 
      p.*,
      u."id" AS "authorId",
      u."username",
      pr."display_name",
      pr."profile_picture",
      COALESCE(l."likeCount", 0) AS "likeCount",
      COALESCE(c."commentCount", 0) AS "commentCount",
      EXISTS (
        SELECT 1 FROM "PostLiked"
        WHERE "post_id" = p."id" AND "author_id" = ${userId}
      ) AS "likedByCurrentUser"
    FROM "Following" f
    JOIN "User" u ON u."id" = f."followedId"
    JOIN "Post" p ON p."author_id" = u."id"
    LEFT JOIN "Profile" pr ON pr."id" = u."id"
    LEFT JOIN (
      SELECT "post_id", COUNT(*) AS "likeCount"
      FROM "PostLiked"
      GROUP BY "post_id"
    ) l ON l."post_id" = p."id"
    LEFT JOIN (
      SELECT "post_id", COUNT(*) AS "commentCount"
      FROM "Comment"
      GROUP BY "post_id"
    ) c ON c."post_id" = p."id"
    WHERE f."followerId" = ${userId}
    ORDER BY p."createdAt" DESC
  `;

  return posts.map((post) => ({
    ...post,
    likeCount: Number(post.likeCount),
    commentCount: Number(post.commentCount),
    likedByCurrentUser: Boolean(post.likedByCurrentUser),
  }));
}

export async function likePost(postId: string, userId: string) {
  await db.$executeRaw`
    INSERT INTO "PostLiked" ("post_id", "author_id")
    VALUES (${postId}, ${userId})
    ON CONFLICT DO NOTHING
  `;
}

export async function unlikePost(postId: string, userId: string) {
  await db.$executeRaw`
    DELETE FROM "PostLiked"
    WHERE "post_id" = ${postId} AND "author_id" = ${userId}
  `;
}

export async function getAllPosts(userId: string) {
  const posts: any[] = await db.$queryRaw`
    SELECT 
      p.*,
      u."id" AS "authorId",
      u."username",
      pr."display_name",
      pr."profile_picture",
      COALESCE(l."likeCount", 0) AS "likeCount",
      COALESCE(c."commentCount", 0) AS "commentCount",
      EXISTS (
        SELECT 1 FROM "PostLiked"
        WHERE "post_id" = p."id" AND "author_id" = ${userId}
      ) AS "likedByCurrentUser"
    FROM "Post" p
    LEFT JOIN "User" u ON u."id" = p."author_id"
    LEFT JOIN "Profile" pr ON pr."id" = u."id"
    LEFT JOIN (
      SELECT "post_id", COUNT(*) AS "likeCount"
      FROM "PostLiked"
      GROUP BY "post_id"
    ) l ON l."post_id" = p."id"
    LEFT JOIN (
      SELECT "post_id", COUNT(*) AS "commentCount"
      FROM "Comment"
      GROUP BY "post_id"
    ) c ON c."post_id" = p."id"
    ORDER BY p."createdAt" DESC
  `;

  return posts.map((post) => ({
    ...post,
    likeCount: Number(post.likeCount),
    commentCount: Number(post.commentCount),
    likedByCurrentUser: Boolean(post.likedByCurrentUser),
  }));
}
