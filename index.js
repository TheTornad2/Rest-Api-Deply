import express, { json } from 'express';
import cors from 'cors';
import moviesRouter from './routes/movies.js';

import { todo } from 'node:test';

const app = express();

app.use(express.json());
app.use(cors());
app.disable('x-powered-by'); // desabilita el header X-Powered-By: Express

app.use('/movies', moviesRouter);

const PORT = process.env.PORT ?? 1234;

// Cambia 'localhost' a '0.0.0.0' para permitir el acceso externo
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
