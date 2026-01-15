import express from 'express';
import { pesanan } from '../controllers/pesananController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pesanan
 *   description: Pesanan API
 */

router.get("/me", authMiddleware, pesanan);

export default router;