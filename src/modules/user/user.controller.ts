import db, { enums } from "@/shared/config/prisma";
import { Gender } from "@/shared/types";
import { Request, Response } from "express";
import * as userService from "./user.service";

export async function followUser(req: Request, res: Response) {
  const user = (req as any).user;
  const followerId = user.id;
  const followedId = req.params.userId;

  if (!followedId || !followedId) {
    res.status(400).json({ message: "Please provide the necessary data" });
    return;
  }

  try {
    const result = await userService.followUser({
      follower: followerId,
      followed: followedId,
    });
    res.status(201).json(result);
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function unfollowUser(req: Request, res: Response) {
  const user = (req as any).user;
  const followerId = user.id;
  const followedId = req.params.userId;

  if (!followedId || !followerId) {
    res.status(400).json({ message: "Please provide the necessary data" });
    return;
  }

  try {
    const result = await userService.unfollowUser({
      follower: followerId,
      followed: followedId,
    });
    res.status(200).json(result);
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function getFollowers(req: Request, res: Response) {
  const userId = req.params.userId;

  if (!userId) {
    res.status(400).json({ message: "Please provide the necessary data" });
    return;
  }
  try {
    const result = await userService.getFollowers({ userId });
    res.status(200).json(result);
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function getFollowing(req: Request, res: Response) {
  const userId = req.params.userId;

  if (!userId) {
    res.status(400).json({ message: "Please provide the necessary data" });
    return;
  }

  try {
    const result = await userService.getFollowing({ userId });
    res.status(200).json(result);
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
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
    const result = await userService.postProfile({
      id: user.id,
      displayName,
      profilePicture,
      bio,
      gender,
      dateOfBirth: dateOfBirthValidated.toISOString(),
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

  console.log("here here");

  try {
    const result = await userService.getProfile({ id: user.id });
    res.status(200).json({ data: result });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function getTheirProfile(req: Request, res: Response) {
  const user = (req as any).user;
  const id = req.params.id;

  try {
    const result = await userService.getTheirProfile({ myId: user.id, id: id });
    console.log({ result });
    res.status(200).json({ data: result });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
    return;
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
    const result = await userService.putProfile({
      id: user.id,
      displayName,
      profilePicture,
      bio,
      gender,
      dateOfBirth: dateOfBirthValidated.toISOString(),
    });
    res.status(200).json({ data: result });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}
