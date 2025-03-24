import { Router } from 'express';
import checkAuthToken from '../middlewares/checkAuthToken';
import { findByUserId, findById, save, update, remove } from '../firebase/db';

const classRouter = Router();

classRouter.post('/classes', checkAuthToken, async (req, res) => {
  try {
    const userId = req.user?.uid;

    if (userId) {
      const { name, section } = req.body;

      if (!name) {
        return res.status(400).json({
          message:
            "O campo 'name' está faltando. O nome da turma é obrigatório.",
        });
      }

      const createdAt = new Date();
      const data = { name, section, userId, createdAt };
      const result = await save('classes', data);

      return res.status(200).json(result);
    } else {
      return res.status(401).json({
        message: 'Você precisa estar logado para acessar este recurso.',
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Error interno no servidor. Tente novamente mais tarde.',
    });
  }
});

classRouter.get('/classes', checkAuthToken, async (req, res) => {
  try {
    const userId = req.user?.uid;

    if (userId) {
      const data = await findByUserId('classes', userId);

      return res.status(200).json(data);
    } else {
      return res.status(401).json({
        message: 'Você precisa estar logado para acessar este recurso.',
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Error interno no servidor. Tente novamente mais tarde.',
    });
  }
});

classRouter.get('/classes/:id', checkAuthToken, async (req, res) => {
  try {
    const userId = req.user?.uid;

    if (userId) {
      const { id } = req.params;
      const data: any = await findById('classes', id);

      if (data.userId !== userId) {
        return res.status(403).json({
          message: 'Você não tem permissão para acessar este recurso.',
        });
      }

      return res.status(200).json(data);
    } else {
      return res.status(401).json({
        message: 'Você precisa estar logado para acessar este recurso.',
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Error interno no servidor. Tente novamente mais tarde.',
    });
  }
});

classRouter.put('/classes/:id', checkAuthToken, async (req, res) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        message: 'Você precisa estar logado para acessar este recurso.',
      });
    }

    const { id } = req.params;
    const result = await findById('classes', id);

    if (!result) {
      return res
        .status(404)
        .json({ message: 'Este recurso não foi encontrado.' });
    }

    if (result.userId !== userId) {
      return res.status(403).json({
        message: 'Você não tem permissão para acessar este recurso.',
      });
    }

    const { name, section } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "O campo 'name' está faltando. O nome da turma é obrigatório.",
      });
    }

    const data = { name, section };
    await update('classes', id, data);

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Error interno no servidor. Tente novamente mais tarde.',
    });
  }
});

classRouter.delete('/classes/:id', checkAuthToken, async (req, res) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        message: 'Você precisa estar logado para acessar este recurso.',
      });
    }

    const { id } = req.params;
    const result = await findById('classes', id);

    if (!result) {
      return res
        .status(404)
        .json({ message: 'Este recurso não foi encontrado.' });
    }

    if (result.userId !== userId) {
      return res
        .status(403)
        .json({ message: 'Você não tem permissão para acessar este recurso.' });
    }

    await remove('classes', id);

    return res.status(200).json({ message: 'Este recurso foi removido.' });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Error interno no servidor. Tente novamente mais tarde.',
    });
  }
});

export default classRouter;
