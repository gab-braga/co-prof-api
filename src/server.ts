import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import userRouter from './routes/user';
import recordingRouter from './routes/recording';

const server = express();

server.use(cors());
server.use(express.json());

server.use(userRouter);
server.use(recordingRouter);

server.listen(3000, () => {});
