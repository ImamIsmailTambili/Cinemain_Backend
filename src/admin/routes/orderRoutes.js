import express from 'express';
import { order } from '../controllers/orderController.js';

const router = express.Router();

router.get("/", order);

export default router;