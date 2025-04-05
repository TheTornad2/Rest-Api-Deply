import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import validateMovie, { validatePartialMovie } from '../schemas/movies.js'; // De acá se crean y se validan las películas.
import { MovieModel } from '../models/movie.js';

const moviesRouter = Router();

//! Get all movies

moviesRouter.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const { genre } = req.query;
  const movies = MovieModel.getAll({ genre });
  res.json(movies);
});

//! Get movies by id.

moviesRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);
  res.status(404).json({ message: 'movie not found' });
});

//! Create Movies.

moviesRouter.post('/', (req, res) => {
  const result = validateMovie(req.body); // Si al hacer el post y valida que es incorrecto lo que le pasamos, pasamos el error

  if (result.error) {
    //! También podemos utilizar el 422
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  //! ... se utiliza para poder copiar todo de la variable a otro lado, no hay problema que copiemos todo porque está validado.
  const newMovie = {
    id: randomUUID(),
    ...result.data,
  };

  // Esto no sería REST, porque estamos guardando el estado de la aplicación en memoria.

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

//! Update the movies.

moviesRouter.patch('/', (req, res) => {
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

//! Delete the movies.

moviesRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  movies.splice(movieIndex, 1);

  return res.json({ message: 'Movie deleted' });
});

export default moviesRouter;
