import Response from '../models/Response.js';
import Request from '../models/Request.js';
import ParamRequest from '../models/ParamRequest.js';
import Collection from '../models/Collection.js';
import Workspace from '../models/Workspace.js';
import dotenv from 'dotenv';

dotenv.config();
const admin_grade = process.env.ADMIN_GRADE || 20;
const viewer_grade = process.env.VIEWER_GRADE || 10;

export const createResponse = async (req, res) => {
    try {
        const { userId } = req.user;
        const { paramRequestId } = req.params;
        const { code, header, body } = req.body;

        const paramRequest = await ParamRequest.findById(paramRequestId);
        if (!paramRequest) {
            return res.status(404).json({ message: "ParamRequest not found" });
        }

        const request = await Request.findById(paramRequest.requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const collection = await Collection.findById(request.collectionId);
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        var userConnectedInCollection = collection.users.find(u => u.userId.toString() === userId.toString());

        const workspaceConnectedUser = await Workspace.findOne({ collections: request.collectionId, "users.userId": userId });
        if (!workspaceConnectedUser) return res.status(404).json({ message: "User not found in workspace" });

        if (!userConnectedInCollection) {
            userConnectedInCollection = workspaceConnectedUser.users.find(u => u.userId.toString() === userId.toString());
        }
        if (!userConnectedInCollection) return res.status(404).json({ message: "User not found in collection or workspace" });

        if (userConnectedInCollection.privilege < viewer_grade) return res.status(403).json({ message: "User not authorized" });

        const newResponse = new Response({
            code,
            header,
            userId,
            body,
            paramRequestId
        });

        await newResponse.save();
        paramRequest.responses.push(newResponse._id);
        await paramRequest.save();
        return res.status(201).json(newResponse);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

        


export const deleteResponse = async (req, res) => {
    try {
        const { responseId } = req.params;
        const { userId } = req.user;

        // Vous pouvez supprimer une réponse uniquement si vous êtes le créateur de la réponse ou si vous êtes un administrateur
        const response = await Response.findById(responseId);
        if (!response) {
            return res.status(404).json({ message: "Response not found" });
        }

        // Vérifier si l'utilisateur est le créateur de la réponse
        if (response.userId.toString() === userId.toString()) {
            await Response.findByIdAndDelete(responseId);
            await ParamRequest.findByIdAndUpdate(response.paramRequestId, { $pull: { responses: responseId } });

            return res.status(200).json({ message: "Response deleted successfully user=user" });
        }

        // Sinon, vérifier les privilèges de l'utilisateur
        const paramRequest = await ParamRequest.findById(response.paramRequestId);
        if (!paramRequest) {
            return res.status(404).json({ message: "ParamRequest not found" });
        }

        const request = await Request.findById(paramRequest.requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const collection = await Collection.findById(request.collectionId);
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        var userConnectedInCollection = collection.users.find(u => u.userId.toString() === userId.toString());

        const workspaceConnectedUser = await Workspace.findOne({ collections: request.collectionId, "users.userId": userId });
        if (!workspaceConnectedUser) return res.status(404).json({ message: "User not found in workspace" });

        if (!userConnectedInCollection) {
            userConnectedInCollection = workspaceConnectedUser.users.find(u => u.userId.toString() === userId.toString());
        }
        if (!userConnectedInCollection) return res.status(404).json({ message: "User not found in collection or workspace" });

        if (userConnectedInCollection.privilege < admin_grade) return res.status(403).json({ message: "User not authorized" });

        // Supprimer la réponse
        await Response.findByIdAndDelete(responseId);

        // Supprimer la réponse de la liste des réponses de la paramRequest
        await ParamRequest.findByIdAndUpdate(response.paramRequestId, { $pull: { responses: responseId } });

        return res.status(200).json({ message: "Response deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getParamRequest = async (req, res) => {
    try {
        const { responseId } = req.params;
        const { userId } = req.user;

        const response = await Response.findById(responseId);
        if (!response) {
            return res.status(404).json({ message: "Response not found" });
        }

        const paramRequest = await ParamRequest.findById(response.paramRequestId);
        if (!paramRequest) {
            return res.status(404).json({ message: "ParamRequest not found" });
        }

        const request = await Request.findById(paramRequest.requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const collection = await Collection.findById(request.collectionId);
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        var userConnectedInCollection = collection.users.find(u => u.userId.toString() === userId.toString());

        const workspaceConnectedUser = await Workspace.findOne({ collections: request.collectionId, "users.userId": userId });
        if (!workspaceConnectedUser) return res.status(404).json({ message: "User not found in workspace" });

        if (!userConnectedInCollection) {
            userConnectedInCollection = workspaceConnectedUser.users.find(u => u.userId.toString() === userId.toString());
        }
        if (!userConnectedInCollection) return res.status(404).json({ message: "User not found in collection or workspace" });

        if (userConnectedInCollection.privilege < viewer_grade) return res.status(403).json({ message: "User not authorized" });

        res.status(200).json(paramRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });     
    }
};