import Response from '../models/Response.js';
import Request from '../models/Request.js';
import ParamRequest from '../models/ParamRequest.js';
import Collection from '../models/Collection.js';
import dotenv from 'dotenv';

dotenv.config();
const admin_grade = process.env.ADMIN_GRADE || 20;
const viewer_grade = process.env.VIEWER_GRADE || 10;

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
        if (response.userId === userId) {
            await Response.findByIdAndDelete(responseId);
            return res.status(200).json({ message: "Response deleted successfully" });
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

        const userInCollection = collection.users.find(userInCollection => userInCollection.UserId.toString() === userId.toString());
        if (!userInCollection || userInCollection.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to delete the response" });
        }

        await Response.findByIdAndDelete(responseId);
        res.status(200).json({ message: "Response deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        const userInCollection = collection.users.find(userInCollection => userInCollection.UserId.toString() === userId.toString());
        if (!userInCollection || userInCollection.privilege < viewer_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to view the paramRequest" });
        }

        res.status(200).json(paramRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });     
    }
};