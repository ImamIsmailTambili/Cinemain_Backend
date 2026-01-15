import express from 'express';
import { kursi, kursiTerpesan } from '../controllers/kursiController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Kursi
 *   description: Kursi API
 */

router.get("/", kursi);

/**
 * @swagger
 * /kursi/terpesan/{jamTayangId}:
 *   get:
 *     summary: Ambil kursi yang sudah dipesan
 *     tags: [Kursi]
 */
router.get("/terpesan/:jamTayangId", kursiTerpesan);

export default router;