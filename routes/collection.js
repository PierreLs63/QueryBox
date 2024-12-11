import express from "express";
import { deleteCollection, getAllRequestsFromCollection, changeCollectionName } from "../controllers/collection.js";
import { createRequest } from "../controllers/request.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/:collectionId", protectRoute, createRequest); // Créer une nouvelle requête
router.delete("/:collectionId", protectRoute, deleteCollection); // Suppression d'une collection
router.get("/:collectionId/requests", protectRoute, getAllRequestsFromCollection); // Récupérer les requêtes d'une collection
router.put("/:collectionId/name", protectRoute, changeCollectionName); // Changer le nom d'une collection

export default router;