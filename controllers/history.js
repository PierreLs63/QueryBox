import Response from '../models/Response.js';
import Request from '../models/Request.js';
import ParamRequest from '../models/ParamRequest.js';
import Workspace from '../models/Workspace.js';
import Collection from '../models/Collection.js';
import dotenv from 'dotenv';

dotenv.config();
const admin_grade = process.env.ADMIN_GRADE || 20;
const viewer_grade = process.env.VIEWER_GRADE || 10;

export const getHistory = async (req, res) => {
    try {
        const { userId } = req.user;
        const { workspaceId } = req.params;
        const { page = 1, perPage = 10 } = req.query;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        // Vérifier si l'utilisateur a le grade viewer dans le workspace
        const userInWorkspace = workspace.users.find(userInWorkspace => userInWorkspace.userId.toString() === userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < viewer_grade || userInWorkspace.hasJoined === false) {
            return res.status(403).json({ message: "You don't have the required privileges to view the history" });
        }

        // Récupérer toutes les collections du workspace
        const collections = await Collection.find({ _id: { $in: workspace.collections } });

        // Récupérer tous les requestIds des collections
        const requestIds = collections.flatMap(collection => collection.requests);

        // Récupérer toutes les réponses des requêtes
        const responses = await Response.find({ requestId: { $in: requestIds } })
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        res.status(200).json(responses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyHistory = async (req, res) => {
    try {
        const { userId } = req.user;
        const { workspaceId } = req.params;
        const { page = 1, perPage = 10 } = req.query;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        // Vérifier si l'utilisateur a le grade viewer dans le workspace
        const userInWorkspace = workspace.users.find(userInWorkspace => userInWorkspace.userId.toString() === userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < viewer_grade || userInWorkspace.hasJoined === false) {
            return res.status(403).json({ message: "You don't have the required privileges to view the history" });
        }

        // Récupérer toutes les collections du workspace
        const collections = await Collection.find({ _id: { $in: workspace.collections } });

        // Récupérer tous les requestIds des collections
        const requestIds = collections.flatMap(collection => collection.requests);

        // Récupérer toutes les réponses des requêtes pour l'utilisateur donné
        const responses = await Response.find({ requestId: { $in: requestIds }, userId })
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        res.status(200).json(responses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};