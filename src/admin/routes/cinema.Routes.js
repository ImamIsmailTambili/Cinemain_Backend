import express from "express";
import { cinema, daerah, addCinema, updateCinema, deleteCinema } from "../controllers/cinemaController.js";

const router = express.Router();

router.get("/", cinema)

router.get("/daerah", daerah)

router.post("/addCinema", addCinema)

router.put("/updateCinema/:id", updateCinema)

router.delete("/deleteCinema/:id", deleteCinema)

export default router; 