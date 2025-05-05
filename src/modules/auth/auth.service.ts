import db from "@/shared/config/prisma";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import env from "@/shared/config/env";

export async function handleLogin(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "please provide email and password" });
    return;
  }

  // check if the user exists
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
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
  const token = jwt.sign({ id: user.id }, env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1d",
  });

  return res
    .status(200)
    .json({ user: { email: user.email, username: user.username }, token });
}

export async function handleRegister(req: Request, res: Response) {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    res
      .status(400)
      .json({ error: "Please provide email, password and username" });
    return;
  }

  try {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    try {
      const user = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
        },
        select: {
          id: true,
          email: true,
          username: true,
        },
      });
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          res.status(400).json({ error: "User already exists" });
        }
      }
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
