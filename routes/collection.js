import express from "express";
import { createCollection } from "../controllers/collection.js";

const router = express.Router();

router.post("/:workspaceId", createCollection); // Création d'une collection dans un workspace avec un nom par défaut


export default router;