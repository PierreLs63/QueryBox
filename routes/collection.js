import express from "express";
import { deleteCollection, getAllRequestsFromCollection } from "../controllers/collection.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.delete("/:collectionId", protectRoute, deleteCollection); // Suppression d'une collection
router.get("/:collectionId/requests", protectRoute, getAllRequestsFromCollection); // Récupérer les requêtes d'une collection

export default router;