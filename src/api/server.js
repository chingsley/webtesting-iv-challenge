import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

const server = express();
server.use(morgan('combined'));
server.use(helmet());

server.get('/', (req, res) => res.status(200).json({ server: 'running...' }));

server.use('/*', (req, res) =>
  res.status(404).json({ error: 'unknown endpoint' })
);

server.use((err, req, res, next) => {
  const error =
    process.env.DB_ENV === 'production' ? 'internal server error' : err;
  res.status(500).json({ error });
});

export default server;
