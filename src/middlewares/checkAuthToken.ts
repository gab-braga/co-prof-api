import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../firebase/auth';
import User from '../interfaces/User';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export default async function checkAuthToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res
        .status(403)
        .json({ message: 'Acesso negado: token não fornecido.' });
    }

    const user = await verifyToken(authorization);

    if (!user) {
      return res
        .status(403)
        .json({ message: 'Acesso negado: token inválido.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Error interno no servidor. Tente novamente mais tarde.',
    });
  }
}
