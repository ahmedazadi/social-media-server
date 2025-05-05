import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "./shared/config/prisma";
import { authenticateToken } from "@/shared/middleware/auth.middleware";
import router from "./modules";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1", router);

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   // validate email and password
//   if (!email || !password) {
//     res.status(400).json({ error: "please provide email and password" });
//     return;
//   }

//   try {
//     // check if the user exists
//     const user = await db.user.findUnique({
//       where: {
//         email,
//       },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         password: true,
//       },
//     });

//     // if the user does not exist, return an error
//     if (!user) {
//       res.status(404).json({ error: "user not found" });
//       return;
//     }

//     // check if the password is correct
//     const isPasswordValid = bcrypt.compareSync(password, user.password);

//     // if the password is not correct, return an error
//     if (!isPasswordValid) {
//       res.status(401).json({ error: "Invalid password" });
//       return;
//     }

//     // create a token
//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.ACCESS_TOKEN_SECRET!,
//       { expiresIn: "1d" }
//     );

//     // send the userinfo and token to the user
//     res.cookie("token", token, { httpOnly: true });
//     res
//       .status(200)
//       .json({ user: { username: user.username, email: user.email }, token });
//     return;
//   } catch (error: any) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// app.post("/register", async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     res.status(400).json({ error: "All fields are required" });
//     return;
//   }

//   try {
//     const saltRounds = 10;
//     const hashedPassword = bcrypt.hashSync(password, saltRounds);

//     const user = await db.user.create({
//       data: {
//         username,
//         email,
//         password: hashedPassword,
//       },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//       },
//     });

//     res.status(201).json(user);
//   } catch (error: any) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // get posts
// app.get("/post", authenticateToken, async (req, res) => {
//   try {
//     console.log("first", (req as any).user!);

//     const posts = await db.$queryRaw`SELECT * FROM "Post";`;

//     res.status(200).json(posts);
//   } catch (error: any) {
//     console.log(error.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

app.listen(3001, () => {
  console.log("Server is running on port 3000");
});
