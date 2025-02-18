import 'dotenv/config';

import express from 'express';
import routerRecording from './routes/recording';
import cors from 'cors';

const server = express();

server.use(cors());

server.use(routerRecording);

server.listen(3000, () => {});
