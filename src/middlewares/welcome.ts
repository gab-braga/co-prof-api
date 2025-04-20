import { NextFunction, Request, Response } from "express";

export default function welcome(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(200).json({ message: "Welcome to CoProf API." });
}
