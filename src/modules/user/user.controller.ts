import db, { enums } from "@/shared/config/prisma";
import { Gender } from "@/shared/types";
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

export async function postProfile(req: Request, res: Response) {
  const user = (req as any).user;

  const { displayName, profilePicture, bio, gender, dateOfBirth } = req.body;

  if (!["M", "F"].includes(gender)) {
    res.status(400).json({ message: `gender must be either 'M' or 'F'` });
    return;
  }

  let dateOfBirthValidated: Date;
  try {
    dateOfBirthValidated = new Date(dateOfBirth);
    if (isNaN(dateOfBirthValidated.getTime())) {
      res.status(400).json({ message: "Invalid date format" });
      return;
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid date format" });
    return;
  }

  try {
    const result = await db.profile.create({
      data: {
        id: user.id,
        display_name: displayName,
        profile_picture: profilePicture,
        bio: bio,
        gender: enums.gender[gender as Gender],
        date_of_birth: dateOfBirthValidated,
      },
    });
    res.status(201).json({ data: result });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function getProfile(req: Request, res: Response) {
  const user = (req as any).user;

  try {
    const result = await db.user.findUnique({
      where: {
        id: user.id,
      },
      omit: {
        password: true,
      },
      include: {
        Profile: {
          select: {
            display_name: true,
            profile_picture: true,
            bio: true,
            gender: true,
            date_of_birth: true,
          },
        },
      },
    });
    res.status(200).json({ data: result });
    return;
  } catch (error: any) {
    console.log(error.message);
  }
}

export async function putProfile(req: Request, res: Response) {
  const user = (req as any).user;

  const { displayName, profilePicture, bio, gender, dateOfBirth } = req.body;

  if (!["M", "F"].includes(gender)) {
    res.status(400).json({ message: `gender must be either 'M' or 'F'` });
    return;
  }

  let dateOfBirthValidated: Date;
  try {
    dateOfBirthValidated = new Date(dateOfBirth);
    if (isNaN(dateOfBirthValidated.getTime())) {
      res.status(400).json({ message: "Invalid date format" });
      return;
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid date format" });
    return;
  }

  try {
    const result = await db.profile.update({
      where: {
        id: user.id,
      },
      data: {
        display_name: displayName,
        profile_picture: profilePicture,
        bio: bio,
        gender: enums.gender[gender as Gender],
        date_of_birth: dateOfBirthValidated,
      },
    });
    res.status(200).json({ data: result });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}
