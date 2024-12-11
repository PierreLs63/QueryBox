import express from "express";
import { deleteCollection } from "../controllers/collection.js";

const router = express.Router();

router.delete("/:collectionId", deleteCollection); // Suppression d'une collection

export default router;