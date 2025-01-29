import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { deleteResponse, getParamRequest, createResponse, getRequestFromResponseId } from "../controllers/response.js";

const router = express.Router();

router.post("/:paramRequestId", protectRoute, createResponse); // Créer une réponse
router.delete("/:responseId", protectRoute, deleteResponse); // Supprimer une réponse
router.get("/:responseId/paramRequest", protectRoute, getParamRequest); // Obtenir le ParamRequest d'une réponse
router.get("/:responseId/requestName", protectRoute, getRequestFromResponseId); // Obtenir le nom d'une requête via le responseId


export default router;