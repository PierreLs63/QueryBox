import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
    createWorkspace,
    changeName,
    deleteWorkspace,
    removeUserBFromWorkspaceFromUserA,
    updatePrivileges,
    getAllCollection,
    inviteUserByUsername,
    joinWorkspace,
    leaveWorkspace,
    getUsersInWorkspace,
    getWorkspaces,
    getWorkspaceById,
} from "../controllers/workspace.js";
import {
    getHistory,
    getMyHistory
} from "../controllers/history.js";
import { createCollection } from "../controllers/collection.js";

const router = express.Router();

router.get("/", protectRoute, getWorkspaces); // Obtenir la liste des workspaces de l'utilisateur connecté
router.post("/", protectRoute, createWorkspace);
router.post("/:workspaceId", protectRoute, createCollection); // Création d'une collection dans un workspace avec un nom par défaut
router.put("/:workspaceId/name", protectRoute, changeName); // Mise à jour du nom du workspace
router.delete("/:workspaceId", protectRoute, deleteWorkspace);
router.put("/:workspaceId/removeUser", protectRoute, removeUserBFromWorkspaceFromUserA); // Mise à jour pour retirer un utilisateur
router.put("/:workspaceId/updatePrivileges", protectRoute, updatePrivileges); // Mise à jour des privilèges
router.get("/:workspaceId/collections", protectRoute, getAllCollection);
router.post("/:workspaceId/invite", protectRoute, inviteUserByUsername); // Invitation d'un utilisateur
router.put("/:workspaceId/join", protectRoute, joinWorkspace); // Mise à jour pour rejoindre un workspace
router.put("/:workspaceId/leave", protectRoute, leaveWorkspace); // Route pour quitter un workspace
router.get("/:workspaceId/users", protectRoute, getUsersInWorkspace); // Obtenir la liste des utilisateurs d'un workspace
router.get("/:workspaceId", protectRoute, getWorkspaceById); // Obtenir un workspace par son id
// Routes pour l'historique
router.get("/:workspaceId/history", protectRoute, getHistory); // Obtenir l'historique complet
router.get("/:workspaceId/history/me", protectRoute, getMyHistory); // Obtenir l'historique de l'utilisateur courant

export default router;