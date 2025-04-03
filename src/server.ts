import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import userRouter from './routes/userRouter';
import classRouter from './routes/classRouter';
import storageRouter from './routes/storageRouter';

const server = express();

server.use(cors());
server.use(express.json());

server.use(userRouter);
server.use(classRouter);
server.use(storageRouter);

server.listen(3000, () => {});
