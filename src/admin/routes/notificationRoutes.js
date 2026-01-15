import express from "express";
import { getNotifications, readNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", getNotifications);

router.put("/:id", readNotification);

export default router;