import { IncomingMessage, ServerResponse } from 'http';
import { createServer } from 'http';
import app from './app/app';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const server = createServer(app);
  server.emit('request', req, res);
}
