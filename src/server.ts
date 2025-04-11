import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import userRouter from './routes/userRouter';
import classRouter from './routes/classRouter';
import storageRouter from './routes/storageRouter';
import recordingRouter from './routes/recordingRouter';

const server = express();

server.use(cors());
server.use(express.json());

server.use(userRouter);
server.use(classRouter);
server.use(storageRouter);
server.use(recordingRouter);

export default server;
