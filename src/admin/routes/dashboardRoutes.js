import express from "express";
import { getDashboard, dashboardChart, recentOrders } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", getDashboard)

router.get("/chart", dashboardChart)

router.get("/recent-order", recentOrders)

export default router;