import { NextFunction, Request, Response } from "express";

export default function checkHealth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const timestamp = new Date().toISOString();

  res.status(200).json({ status: "healthy", timestamp });
}
