import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import userRouter from './routes/userRouter';
import classRouter from './routes/classRouter';

const server = express();

server.use(cors());
server.use(express.json());

server.use(userRouter);
server.use(classRouter);

server.listen(3000, () => {});
