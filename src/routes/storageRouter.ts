import { Router } from 'express';
import multer from 'multer';
import checkAuthToken from '../middlewares/checkAuthToken';
import { uploadFile } from '../firebase/storage';

const storageRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

storageRouter.post(
  '/storage/upload',
  checkAuthToken,
  upload.single('file'),
  async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          message: 'Você precisa estar logado para acessar este recurso.',
        });
      }

      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
      }

      const userId = user.uid as string;
      const fileUrl = await uploadFile(file, userId);

      return res.status(200).json({ fileUrl });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error interno no servidor. Tente novamente mais tarde.',
      });
    }
  },
);

export default storageRouter;
