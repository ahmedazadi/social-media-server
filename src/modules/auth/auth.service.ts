import db from "@/shared/config/prisma";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma, User } from "@prisma/client";
import env from "@/shared/config/env";

export async function handleLogin(req: Request, res: Response) {
  const { email, password } = req.body;

  console.log("email", email);
  console.log("password", password);

  if (!email || !password) {
    res.status(400).json({ error: "please provide email and password" });
    return;
  }

  // check if the user exists
  let user: User | null = null;
  try {
    const [result]: any = await db.$queryRaw`
    SELECT * FROM "User" WHERE "email" = ${email.toLowerCase()}
  `;
    user = result;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  if (!user) {
    res.status(404).json({ error: "user not found" });
    return;
  }

  // check if the password is correct
  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  // generate a token
  const token = jwt.sign(
    { id: user.id, username: user.username },
    env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  return res.status(200).json({
    user: { id: user.id, email: user.email, username: user.username },
    token,
  });
}

export async function handleRegister(req: Request, res: Response) {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ error: "Please provide email, password and username" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const [user]: any = await db.$queryRaw`
      INSERT INTO "User" (
        "id", "email", "password", "username",
        "createdAt", "updatedAt",
        "email_verified", "phone_verified", "two_factor_enabled", "status"
      ) VALUES (
        gen_random_uuid(), ${email.toLowerCase()}, ${hashedPassword}, ${username},
        NOW(), NOW(),
        false, false, false, 1
      )
      RETURNING "id", "email", "username"
    `;

    return res.status(201).json(user);
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(400).json({ error: "User already exists" });
    }

    console.error(error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
