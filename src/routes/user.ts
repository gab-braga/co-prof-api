import { Router } from 'express';
import { createUser } from '../firebase/auth';
import User from '../interfaces/User';

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

export default userRouter;
