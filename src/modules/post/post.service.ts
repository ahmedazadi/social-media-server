import db from "@/shared/config/prisma";

export async function createPost(content: string, author_id: string) {
  const post = await db.post.create({
    data: { content, author_id },
  });

  return post;
}

export async function getPostById(id: string) {
  const post = await db.post.findUnique({
    where: { id },
  });

  return post;
}

export async function getPosts() {
  const posts = await db.post.findMany();

  return posts;
}

export async function getPostsByAuthor(author_id: string) {
  const posts = await db.post.findMany({
    where: { author_id },
  });

  return posts;
}

export async function getPostsFromFollowing(user_id: string) {
  const posts = await db.$queryRawUnsafe(
    `
    SELECT p.*
    FROM "Post" p
    JOIN "Following" f ON p."author_id" = f."followedId"
    WHERE f."followerId" = $1
    ORDER BY p."createdAt" DESC
  `,
    user_id
  );

  return posts;
}
