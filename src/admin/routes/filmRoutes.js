import express from "express";
import { film, addFilm, updateFilm, deleteFilm } from "../controllers/filmController.js";

const router = express.Router();

router.get("/", film)

router.post("/addFilm", addFilm)

router.put("/updateFilm/:id", updateFilm)

router.delete("/deleteFilm/:id", deleteFilm)

export default router; 