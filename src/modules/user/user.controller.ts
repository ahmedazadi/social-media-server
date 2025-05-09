import db from "@/shared/config/prisma";
import { Request, Response } from "express";

export async function followUser(req: Request, res: Response) {
  const user = (req as any).user;
  const followerId = user.id;
  const followedId = req.params.userId;

  if (!followedId || !followedId) {
    res.status(400).json({ message: "Please provide the necessary data" });
    return;
  }

  const result = await db.following.create({
    data: {
      followerId: followerId,
      followedId: followedId,
    },
    include: {
      followed: { select: { username: true } },
      follower: { select: { username: true } },
    },
  });

  res.json(result);
  return;
}

export async function unfollowUser(req: Request, res: Response) {
  const user = (req as any).user;
  const followerId = user.id;
  const followedId = req.params.userId;

  if (!followedId || !followerId) {
    res.status(400).json({ message: "Please provide the necessary data" });
    return;
  }

  const result = await db.following.delete({
    where: {
      followerId_followedId: {
        followedId,
        followerId,
      },
    },
    include: {
      followed: { select: { username: true } },
      follower: { select: { username: true } },
    },
  });

  res.json(result);
  return;
}

export async function getFollowers(req: Request, res: Response) {
  const userId = req.params.userId;

  if (!userId) {
    res.status(400).json({ message: "Please provide the necessary data" });
    return;
  }

  const result = await db.following.findMany({
    where: {
      followedId: userId,
    },
    omit: {
      followerId: true,
      followedId: true,
    },
    include: {
      follower: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  res.status(200).json(result);
  return;
}

export async function getFollowing(req: Request, res: Response) {
  const userId = req.params.userId;

  if (!userId) {
    res.status(400).json({ message: "Please provide the necessary data" });
    return;
  }

  const result = await db.following.findMany({
    where: {
      followerId: userId,
    },
    omit: {
      followerId: true,
      followedId: true,
    },
    include: {
      followed: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  res.status(200).json(result);
  return;
}
