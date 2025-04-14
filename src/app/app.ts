import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import userRouter from '../routes/userRouter';
import classRouter from '../routes/classRouter';
import storageRouter from '../routes/storageRouter';
import recordingRouter from '../routes/recordingRouter';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '200mb' }));

app.use(userRouter);
app.use(classRouter);
app.use(storageRouter);
app.use(recordingRouter);

export default app;
