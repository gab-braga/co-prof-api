import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../firebase/storage';

const storageRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

storageRouter.post(
  '/storage/upload',
  upload.single('file'),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
      }

      const urlFile = await uploadFile(file);

      return res.status(200).json({ urlFile });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error interno no servidor. Tente novamente mais tarde.',
      });
    }
  },
);

export default storageRouter;
