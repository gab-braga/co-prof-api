import { Router } from 'express';
import checkAuthToken from '../middlewares/checkAuthToken';
import { findById, findWithFilters, save } from '../firebase/db';

const recordingRouter = Router();

recordingRouter.post('/recordings', checkAuthToken, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: 'Você precisa estar logado para acessar este recurso.',
      });
    }

    const { classId, recordingUrl } = req.body;
    if (!classId || !recordingUrl) {
      return res.status(400).json({
        message:
          'Algumas informações estão faltando. Verifique e tente novamente.',
      });
    }

    const result = await findById('classes', classId);

    if (!result) {
      return res.status(404).json({
        message: 'Este recurso não foi encontrado.',
      });
    }

    const userId = user.uid as string;

    if (result.userId !== userId) {
      return res.status(401).json({
        message: 'Você não tem autorização para acessar este recurso.',
      });
    }

    const createdAtMillis = Date.now();
    const createdAt = new Date(createdAtMillis);
    const data = { userId, classId, recordingUrl, createdAtMillis, createdAt };
    const recording = await save('recordings', data);

    return res.status(200).json(recording);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Error interno no servidor. Tente novamente mais tarde.',
    });
  }
});

recordingRouter.get('/recordings/classes/:id', checkAuthToken, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: 'Você precisa estar logado para acessar este recurso.',
      });
    }

    const classId = req.params.id;
    const result = await findById('classes', classId);

    if (!result) {
      return res.status(404).json({
        message: 'Este recurso não foi encontrado.',
      });
    }

    const userId = user.uid as string;

    if (result.userId !== userId) {
      return res.status(401).json({
        message: 'Você não tem autorização para acessar este recurso.',
      });
    }

    const recordings = await findWithFilters('recordings', [
      { field: "userId", value: userId },
      { field: "classId", value: classId }
    ]);

    return res.status(200).json(recordings);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Error interno no servidor. Tente novamente mais tarde.',
    });
  }
});

export default recordingRouter;
