import path from 'path';

import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import * as url from 'url';

import articleApi from './apis/article.js';
import noteApi from './apis/note.js';
import uploadAPI from './apis/upload.js';
import userApi from './apis/user.js';
import connectingToDB from './db.js';

dotenv.config();

const { log } = console;
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const server = express();

server.use(
  cors({
    origin: ['http://www.trigold.tech'],
  }),
);

server.use(morgan('dev'));
server.use(compression());
server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.json({ limit: '50mb' }));
server.use(express.static(path.join(__dirname, 'public')));

server.use('/api', articleApi);
server.use('/api', noteApi);
server.use('/api', userApi);
server.use('/api', uploadAPI);

server.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT;

server.listen(port, () => log(`web 服务器进程已经监听在 localhost:${port}`));

connectingToDB();
