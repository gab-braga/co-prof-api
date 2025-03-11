import { Router } from 'express';
import checkAuthToken from '../middlewares/checkAuthToken';

const recordingRouter = Router();

recordingRouter.post('/recording', checkAuthToken, async (req, res) => {
  try {
    res.status(200).json({ message: 'Liberado!!!' });
  } catch (error) {
    return res.status(500).json({ message: 'Error' });
  }
});

export default recordingRouter;
