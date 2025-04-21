import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import userRouter from '../routes/userRouter';
import classRouter from '../routes/classRouter';
import storageRouter from '../routes/storageRouter';
import recordingRouter from '../routes/recordingRouter';
import speechRouter from '../routes/speechRouter';
import welcome from '../middlewares/welcome';
import checkHealth from '../middlewares/checkHealth';
import notFound from '../middlewares/notFound';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '200mb' }));

app.get("/", welcome);
app.get("/health", checkHealth);

app.use(userRouter);
app.use(classRouter);
app.use(storageRouter);
app.use(recordingRouter);
app.use(speechRouter);

app.use(notFound);

export default app;
