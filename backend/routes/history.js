import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getHistory, getMyHistory } from "../controllers/history.js";

const router = express.Router();

router.get("/:workspaceId", protectRoute, getHistory); // Créer une réponse
router.get("/:workspaceId/me", protectRoute, getMyHistory); // Supprimer une réponse


export default router;