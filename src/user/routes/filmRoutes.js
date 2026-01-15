import express from 'express';
import { film, getFilmById } from '../controllers/filmController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Film
 *   description: Film API
 */

router.get("/", film);

/**
 * @swagger
 * /film/{id}:
 *   get:
 *     summary: Ambil detail film
 *     tags: [Film]
 */
router.get("/:id", getFilmById);

export default router;