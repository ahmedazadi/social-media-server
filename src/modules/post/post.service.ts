import db from "@/shared/config/prisma";

export async function createPost(content: string, author_id: string) {
  const post = await db.post.create({
    data: { content, author_id },
  });

  return post;
}
