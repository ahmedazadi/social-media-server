import db, { enums } from "@/shared/config/prisma";
import { Gender } from "@/shared/types";

export async function followUser({
  follower,
  followed,
}: {
  follower: string;
  followed: string;
}) {
  const result = await db.$executeRaw`
  INSERT INTO "Following" ("followerId", "followedId", "createdAt")
  VALUES (${follower}, ${followed}, NOW())
`;

  return result;
}

export async function unfollowUser({
  follower,
  followed,
}: {
  follower: string;
  followed: string;
}) {
  const result = await db.$executeRaw`
  DELETE FROM "Following" WHERE "followerId" = ${follower} AND "followedId" = ${followed}
  `;
  return result;
}

export async function getFollowers({ userId }: { userId: string }) {
  const result = await db.$queryRaw`
  SELECT 
    u."id",
    u."username",
    p."display_name",
    p."profile_picture"
  FROM "Following" f
  JOIN "User" u ON u."id" = f."followerId"
  LEFT JOIN "Profile" p ON p."id" = u."id"
  WHERE f."followedId" = ${userId}
`;

  return result;
}

export async function getFollowing({ userId }: { userId: string }) {
  const result = await db.$queryRaw`
  SELECT 
    u."id",
    u."username",
    p."display_name",
    p."profile_picture"
  FROM "Following" f
  JOIN "User" u ON u."id" = f."followedId"
  LEFT JOIN "Profile" p ON p."id" = u."id"
  WHERE f."followerId" = ${userId}
`;

  return result;
}

export async function postProfile({
  id,
  displayName,
  profilePicture,
  bio,
  gender,
  dateOfBirth,
}: {
  id: string;
  displayName: string;
  profilePicture: string;
  bio: string;
  gender: string;
  dateOfBirth: Date;
}) {
  const result = await db.$executeRaw`
  INSERT INTO "Profile" (
    "id", "display_name", "profile_picture", "bio", "gender", "date_of_birth"
  ) VALUES (
    ${id}, ${displayName}, ${profilePicture}, ${bio},
    ${gender === "M" ? 1 : 2}, ${dateOfBirth}
  )
`;
  return result;
}

export async function getProfile({ id }: { id: string }) {
  const [result]: any = await db.$queryRaw`
    SELECT 
      u."id",
      u."username",
      u."email",
      u."email_verified",
      u."phone",
      u."phone_verified",
      u."two_factor_enabled",
      u."status",
      u."createdAt",
      u."updatedAt",
      p."display_name",
      p."profile_picture",
      p."bio",
      p."gender",
      p."date_of_birth",

      -- Count of followers
      (SELECT COUNT(*) FROM "Following" f WHERE f."followedId" = u."id") AS "followersCount",
      
      -- Count of following
      (SELECT COUNT(*) FROM "Following" f WHERE f."followerId" = u."id") AS "followingCount",

      -- Count of posts
      (SELECT COUNT(*) FROM "Post" po WHERE po."author_id" = u."id") AS "postsCount"

    FROM "User" u
    LEFT JOIN "Profile" p ON u."id" = p."id"
    WHERE u."id" = ${id}
  `;

  return {
    ...result,
    followersCount: Number(result.followersCount),
    followingCount: Number(result.followingCount),
    postsCount: Number(result.postsCount),
  };
}

export async function getTheirProfile({
  myId,
  id,
}: {
  myId: string;
  id: string;
}) {
  const [result]: any = await db.$queryRaw`
    SELECT 
      u."id",
      u."username",
      u."email",
      u."email_verified",
      u."phone",
      u."phone_verified",
      u."two_factor_enabled",
      u."status",
      u."createdAt",
      u."updatedAt",
      p."display_name",
      p."profile_picture",
      p."bio",
      p."gender",
      p."date_of_birth",

      -- Count of followers
      (SELECT COUNT(*) FROM "Following" f WHERE f."followedId" = u."id") AS "followersCount",
      
      -- Count of following
      (SELECT COUNT(*) FROM "Following" f WHERE f."followerId" = u."id") AS "followingCount",

      -- Count of posts
      (SELECT COUNT(*) FROM "Post" po WHERE po."author_id" = u."id") AS "postsCount",

      -- Whether current user follows this profile
      EXISTS (
        SELECT 1 FROM "Following" f
        WHERE f."followerId" = ${myId} AND f."followedId" = u."id"
      ) AS "isFollowing"

    FROM "User" u
    LEFT JOIN "Profile" p ON u."id" = p."id"
    WHERE u."id" = ${id}
  `;

  return {
    ...result,
    followersCount: Number(result.followersCount),
    followingCount: Number(result.followingCount),
    postsCount: Number(result.postsCount),
    isFollowing: Boolean(result.isFollowing),
  };
}
export async function putProfile({
  id,
  displayName,
  profilePicture,
  bio,
  gender,
  dateOfBirth,
}: {
  id: string;
  displayName: string;
  profilePicture: string;
  bio: string;
  gender: Gender;
  dateOfBirth: string;
}) {
  const genderValue = enums.gender[gender];
  const dateOfBirthValidated = new Date(dateOfBirth);
  const result = await db.$executeRaw`
  UPDATE "Profile" SET "display_name" = ${displayName}, "profile_picture" = ${profilePicture}, "bio" = ${bio}, "gender" = ${genderValue}, "date_of_birth" = ${dateOfBirthValidated} WHERE "id" = ${id}
  `;
  return result;
}
