import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import responseTime from 'response-time';
import router from './router';

const server = express();
server.use(express.json()); // without this line, req.body will be undefiend.
server.use(helmet());
server.use(responseTime());
server.use(
  morgan('tiny', {
    skip: () => (process.env.DB_ENV === 'testing' ? true : false),
  })
);

server.get('/', (req, res) => res.status(200).json({ server: 'running...' }));
server.use('/api', router);

server.use('/*', (req, res) =>
  res.status(404).json({ error: 'unknown endpoint' })
);

server.use((err, req, res, next) => {
  const error =
    process.env.DB_ENV === 'production' ? 'internal server error' : err;
  res.status(500).json({ error });
});

export default server;
