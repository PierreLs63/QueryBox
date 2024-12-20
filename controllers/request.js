import Response from '../models/Response.js';
import Request from '../models/Request.js';
import ParamRequest from '../models/ParamRequest.js';
import Collection from '../models/Collection.js';
import dotenv from 'dotenv';
import Workspace from '../models/Workspace.js';

dotenv.config();
const admin_grade = process.env.ADMIN_GRADE || 20;
const viewer_grade = process.env.VIEWER_GRADE || 10;

export const createRequest = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { userId } = req.user;

        const collection = await Collection.findById(collectionId);
        
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }


        var user = collection.users.find(u => u.userId.toString() === userId.toString());

        // Si l'utilisateur n'est pas dans la collection, on vérifie s'il est dans le workspace de la collection
        if (!user) {
            user = await Workspace.findOne({ collections: collectionId, "users.userId": userId });
        }
        // Si l'utilisateur n'est pas dans la collection ou le workspace, on retourne une erreur
        if (!user) {
            return res.status(404).json({ message: "User not found in workspace or collection" });
        }
        
        if (user.privilege < viewer_grade) {
            return res.status(401).json({ message: "User not authorized" });
        }

        // Créer une nouvelle requête
        const request = new Request({ name: "Untitled Request", collectionId: collectionId });
        await request.save();

        // Ajouter la requête à la collection
        collection.requests.push(request._id);
        await collection.save();
        res.status(201).json(request);
    } catch (error) {
        res.status(409).json({ message: error.message }); 
    }
}

export const changeName = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { name } = req.body;
        const { userId } = req.user;

        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        
        const collection = await Collection.findById(request.collectionId);
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        var userInCollection = collection.users.find(u => u.userId.toString() === userId.toString());

        // Si l'utilisateur n'est pas dans la collection, on vérifie s'il est dans le workspace de la collection
        if (!userInCollection) {
            userInCollection = await Workspace.findOne({ collections: request.collectionId, "users.userId": userId });
        }
        // Si l'utilisateur n'est pas dans la collection ou le workspace, on retourne une erreur
        if (!userInCollection) {
            return res.status(404).json({ message: "User not found in workspace or collection" });
        }
        if (userInCollection.privilege < viewer_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to change the name of the request" });
        }
        request.name = name;
        await request.save();
        res.status(200).json({ message: "Request name changed successfully"});
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const createParamRequestAndUpdateRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { url, method, body, header, parameters, responses } = req.body;
        const { userId } = req.user;

        // Vérifier si la requête existe
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Trouver la collection associée à la requête
        const collection = await Collection.findById(request.collectionId);
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        // Vérifier si l'utilisateur a le grade viewer dans la collection
        const userInCollection = collection.users.find(userInCollection => userInCollection.UserId.toString() === userId.toString());
        if (!userInCollection || userInCollection.privilege < viewer_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to create a param request" });
        }

        // Créer un nouveau ParamRequest
        const newParamRequest = new ParamRequest({
            requestId,
            url,
            method,
            body,
            header,
            parameters,
            responses,
            userId
        });

        await newParamRequest.save();

        // Ajouter le nouveau ParamRequest à l'historique de la requête
        request.paramRequests.push(newParamRequest._id);
        await request.save();

        // Exécuter la requête
        const response = await executeRequest(request, newParamRequest);

        res.status(201).json({ paramRequest: newParamRequest, response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { userId } = req.user;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const collection = await Collection.findById(request.collectionId);
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        var userInCollection = collection.users.find(u => u.userId.toString() === userId.toString());

        // Si l'utilisateur n'est pas dans la collection, on vérifie s'il est dans le workspace de la collection
        if (!userInCollection) {
            userInCollection = await Workspace.findOne({ collections: request.collectionId, "users.userId": userId });
        }
        // Si l'utilisateur n'est pas dans la collection ou le workspace, on retourne une erreur
        if (!userInCollection) {
            return res.status(404).json({ message: "User not found in workspace or collection" });
        }

        if (userInCollection.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to delete the request" });
        }

        await Request.findByIdAndRemove(requestId);
        res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteParamRequest = async (req, res) => {
    try {
        const { paramRequestId } = req.params;
        const { userId } = req.user;

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

        const userInCollection = collection.users.find(userInCollection => userInCollection.UserId.toString() === userId.toString());
        if (!userInCollection || userInCollection.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to delete the param request" });
        }
        await ParamRequest.findByIdAndRemove(paramRequestId);
        res.status(200).json({ message: "ParamRequest deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getRequests = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { userId } = req.user;
        const { page = 1, perPage = 10 } = req.query;

        const collection = await Collection.findById(collectionId);
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        const userInCollection = collection.users.find(userInCollection => userInCollection.UserId.toString() === userId.toString());
        if (!userInCollection) {
            return res.status(404).json({ message: "User not found in collection" });
        }
        const requests = await Request.find({ collectionId: collectionId })
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const executeRequest = async (request, paramRequest) => {
    const { url, method, body, header, parameters } = paramRequest;

    // Préparer les en-têtes pour la requête
    const headers = {};
    header.forEach(h => {
        headers[h.key] = h.value;
    });

    // Préparer les paramètres pour la requête
    const queryParams = new URLSearchParams();
    parameters.forEach(p => {
        queryParams.append(p.key, p.value);
    });

    // Construire l'URL avec les paramètres
    const requestUrl = `${url}?${queryParams.toString()}`;

    // Envoyer la requête au serveur avec fetch
    const api = await fetch(requestUrl, {
        method,
        headers,
        body: method !== 'GET' ? body : undefined // Le corps de la requête n'est pas utilisé pour les requêtes GET
    });

    if (!api.ok) {
        throw new Error("Error while fetching the request");
    }

    // Préparer les en-têtes de la réponse
    const responseHeaders = [];
    api.headers.forEach((value, key) => {
        responseHeaders.push({ key, value });
    });

    // Créer une nouvelle réponse
    const response = new Response({
        paramRequestId: paramRequest._id,
        code: api.status,
        body: await api.text(),
        header: responseHeaders,
        userId: paramRequest.userId
    });

    await response.save();
};