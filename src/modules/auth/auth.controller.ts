import { Request, Response } from "express";
import { handleLogin, handleRegister } from "./auth.service";

export function login(req: Request, res: Response) {
  handleLogin(req, res);
  return;
}

export async function register(req: Request, res: Response) {
  console.log("register");
  await handleRegister(req, res);
  return;
}
