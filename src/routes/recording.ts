import { Router } from 'express';
import { verifyToken } from '../firebase/auth';

const recordingRouter = Router();

recordingRouter.post('/recording', async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const user = await verifyToken(authorization);
      res.status(200).json({ user });
    } else throw new Error('Token ausente');
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});

export default recordingRouter;
