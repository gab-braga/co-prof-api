import { Router } from 'express';
import { createUser, updateUser } from '../firebase/auth';
import User from '../interfaces/User';
import checkAuthToken from '../middlewares/checkAuthToken';

const userRouter = Router();

userRouter.post('/users', async (req, res) => {
  try {
    const { name, email, password }: User = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          'Algumas informações estão faltando. Verifique e tente novamente.',
      });
    }

    const user = await createUser({ name, email, password });
    return res.status(201).json({
      message: 'Cadastro concluído!',
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Erro interno no servidor. Tente novamente mais tarde',
    });
  }
});

userRouter.put('/users', checkAuthToken, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: 'Você precisa estar logado para acessar este recurso.',
      });
    }

    const userId = user.uid as string;
    const { name, email } = req.body;
    const data = { name, email };
    const result = await updateUser(userId, data);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Error interno no servidor. Tente novamente mais tarde.',
    });
  }
});

userRouter.get('/users/me', checkAuthToken, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: 'Você precisa estar logado para acessar este recurso.',
      });
    }

    const { uid, name, email, picture, email_verified } = user;
    const data = { uid, name, email, picture, email_verified };

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Error interno no servidor. Tente novamente mais tarde.',
    });
  }
});

export default userRouter;
