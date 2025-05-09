import db from "@/shared/config/prisma";

export async function createComment(
  content: string,
  postId: string,
  userId: string
) {
  const comment = await db.comment.create({
    data: {
      content,
      post_id: postId,
      user_id: userId,
    },
  });

  return comment;
}

export async function getCommentsByPostId(postId: string) {
  const comments = await db.comment.findMany({
    where: {
      post_id: postId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return comments;
}

export async function deleteComment(commentId: string, userId: string) {
  const comment = await db.comment.delete({
    where: {
      id: commentId,
      user_id: userId,
    },
  });

  return comment;
}

export async function updateComment(
  commentId: string,
  content: string,
  userId: string
) {
  const comment = await db.comment.update({
    where: {
      id: commentId,
      user_id: userId,
    },
    data: {
      content,
    },
  });

  return comment;
}
