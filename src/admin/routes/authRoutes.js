import express from "express";
import { registerAdmin, loginAdmin, logoutAdmin, admin } from "../controllers/authController.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin)

router.post("/login", loginAdmin)

router.get("/me", adminMiddleware, admin);

router.post("/logout", adminMiddleware, logoutAdmin)

export default router;
