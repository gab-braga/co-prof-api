import { Router } from 'express';
import checkAuthToken from '../middlewares/checkAuthToken';
import { findAll, findById, save } from '../firebase/db';

const classRouter = Router();

classRouter.post('/classes', checkAuthToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const data = { name, description };
    const result = await save('classes', data);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: 'Error interno no servidor. Tente novamente mais tarde.',
    });
  }
});

classRouter.get('/classes', checkAuthToken, async (req, res) => {
  try {
    const data = await findAll('classes');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: 'Error interno no servidor. Tente novamente mais tarde.',
    });
  }
});

classRouter.get('/classes/:id', checkAuthToken, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await findById('classes', id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: 'Error interno no servidor. Tente novamente mais tarde.',
    });
  }
});

export default classRouter;
