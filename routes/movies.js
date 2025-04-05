import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import validateMovie, { validatePartialMovie } from '../schemas/movies.js';
import { MovieModel } from '../models/movie.js';

const moviesRouter = Router();

// Obtener todas las películas (con filtro por género)
moviesRouter.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const { genre } = req.query;
  const movies = MovieModel.getAll({ genre });
  res.json(movies);
});

// Obtener película por ID
moviesRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const movie = MovieModel.getById({ id }); // Usa el modelo
  if (movie) return res.json(movie);
  res.status(404).json({ message: 'Movie not found' });
});

// Crear película
moviesRouter.post('/', (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: randomUUID(),
    ...result.data,
  };

  MovieModel.create({ input: newMovie }); // Usa el modelo
  res.status(201).json(newMovie);
});

// Actualizar película (PATCH)
moviesRouter.patch('/:id', (req, res) => {
  // ¡Falta :id en la ruta!
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const updatedMovie = MovieModel.update({ id, input: result.data }); // Usa el modelo

  if (!updatedMovie) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  return res.json(updatedMovie);
});

// Eliminar película
moviesRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deleted = MovieModel.delete({ id }); // Usa el modelo

  if (!deleted) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  return res.json({ message: 'Movie deleted' });
});

export default moviesRouter;
