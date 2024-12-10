import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { deleteResponse, getParamRequest } from "../controllers/response.js";

const router = express.Router();

router.delete("/:responseId", protectRoute, deleteResponse); // Supprimer une réponse
router.get("/:responseId/paramRequest", protectRoute, getParamRequest); // Obtenir le ParamRequest d'une réponse

export default router;