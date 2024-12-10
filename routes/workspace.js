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
    leaveWorkspace
} from "../controllers/workspace.js";

const router = express.Router();

router.post("/", protectRoute, createWorkspace);
router.put("/:workspaceId/name", protectRoute, changeName); // Mise à jour du nom du workspace
router.delete("/:workspaceId", protectRoute, deleteWorkspace);
router.put("/:workspaceId/removeUser", protectRoute, removeUserBFromWorkspaceFromUserA); // Mise à jour pour retirer un utilisateur
router.put("/:workspaceId/updatePrivileges", protectRoute, updatePrivileges); // Mise à jour des privilèges
router.get("/:workspaceId/collections", protectRoute, getAllCollection);
router.post("/:workspaceId/invite", protectRoute, inviteUserByUsername); // Invitation d'un utilisateur
router.put("/:workspaceId/join", protectRoute, joinWorkspace); // Mise à jour pour rejoindre un workspace
router.put("/:workspaceId/leave", protectRoute, leaveWorkspace); // Route pour quitter un workspace

export default router;