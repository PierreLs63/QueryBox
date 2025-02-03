import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
    createRequest,
    changeName,
    createParamRequestAndUpdateRequest,
    deleteRequest,
    deleteParamRequest,
    getLastParamRequest,
    getRequestById
} from "../controllers/request.js";

const router = express.Router();

router.put("/:requestId/name", protectRoute, changeName); // Changer le nom d'une requête
router.post("/:requestId/paramRequest", protectRoute, createParamRequestAndUpdateRequest); // Créer un nouveau ParamRequest et mettre à jour la requête
router.delete("/:requestId", protectRoute, deleteRequest); // Supprimer une requête
router.delete("/paramRequests/:paramRequestId", protectRoute, deleteParamRequest); // Supprimer un ParamRequest
router.get("/:requestId/lastParamRequest", protectRoute, getLastParamRequest); // Créer une nouvelle requête
router.get("/:requestId", protectRoute, getRequestById); // Obtenir une requête par son id
export default router;