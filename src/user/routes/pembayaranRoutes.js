import express from 'express';
import { pembayaran } from '../controllers/pembayaranController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pembayaran
 *   description: Pembayaran & Booking Kursi
 */

router.post("/", pembayaran);


export default router;