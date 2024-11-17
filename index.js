import express, { json } from 'express';
import movies from './movies.json' with { type: 'json' };
import crypto from 'crypto'; //Se utiliza para generar ID aleatorias
import validateMovie, { validatePartialMovie } from './schemas/movies.js'; //De acá se crean y se validan las películas.
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors());
app.disable('x-powered-by'); // desabilita el header X-Powered-By: Express

const ACCEPTED_ORIGINS = [
  'http://localhost:1234',
  'http://localhost:8080',
  'http://localhost:1234/movies',
  'http://localhost:1234/movies:id',
];

//!Obtener todas las películas

app.get('/movies', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');

  const { genre } = req.query;

  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }

  res.json(movies);
});

//Filtrar por ID

app.get('/movies/:id', (req, res) => {
  const { id } = req.params;

  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);
  res.status(404).json({ message: 'movie not found' });
});

//Crear película

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body); //Si al hacer el post y valida que es incorrecto lo que le pasamos, pasamos el error

  if (result.error) {
    //! También podemos utilizar el 422
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  //! ... se utiliza para poder copiar todo de la variable a otro lado, no hay problema que copiemos todo porque está validado.
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  //Esto no sería REST, porque estamos guardando el estado de la aplicación en memoria.

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

//! Actualizar película

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;

  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;

  return res.json(updateMovie);
});

//! Eliminar

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  movies.splice(movieIndex, 1);

  return res.json({ message: 'Movie deleted' });
});

const PORT = process.env.PORT ?? 1234;

// Cambia 'localhost' a '0.0.0.0' para permitir el acceso externo
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
