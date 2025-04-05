import { readJSON } from '../utils.js';
import { randomUUID } from 'node:crypto';
const movies = readJSON('./movies.json');

export class MovieModel {
  // Obtener todas las películas (con filtro por género)
  static getAll({ genre }) {
    if (genre) {
      return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }
    return movies;
  }

  // Obtener película por ID
  static getById({ id }) {
    return movies.find((movie) => movie.id === id);
  }

  // Crear película
  static create({ input }) {
    const newMovie = {
      id: randomUUID(), // Genera un ID único
      ...input,
    };
    movies.push(newMovie);
    return newMovie;
  }

  // Actualizar película
  static update({ id, input }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;

    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input,
    };
    return movies[movieIndex];
  }

  // Eliminar película
  static delete({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;

    movies.splice(movieIndex, 1);
    return true;
  }
}
