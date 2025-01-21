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


        var userConnectedInCollection = collection.users.find(u => u.userId.toString() === userId.toString());

        const workspaceConnectedUser = await Workspace.findOne({ collections: collectionId, "users.userId": userId });
        if (!workspaceConnectedUser) return res.status(404).json({ message: "User not found in workspace" });

        if (!userConnectedInCollection) {
            userConnectedInCollection = workspaceConnectedUser.users.find(u => u.userId.toString() === userId.toString());
        }
        if (!userConnectedInCollection) return res.status(404).json({ message: "User not found in collection or workspace" });
        
        if (userConnectedInCollection.privilege < admin_grade) {
            return res.status(401).json({ message: "User not authorized" });
        }

        // Créer une nouvelle requête
        const request = new Request({ name: "Untitled Request", collectionId: collectionId });
        await request.save();

        // Ajouter la requête à la collection
        collection.requests.push(request._id);
        await collection.save();
        return res.status(201).json({message: "Request created successfully", ...request._doc});
    } catch (error) {
        return res.status(409).json({ message: error.message }); 
    }
}

export const changeName = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { name } = req.body;
        const { userId } = req.user;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const request = await Request.findById(requestId);

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

        if (request.name !== name) {
            request.name = name;
            await request.save();
        }

        return res.status(200).json({ message: "Request name changed successfully"});
    } catch (error) {
        return res.status(409).json({ message: error.message });
    }
}

export const createParamRequestAndUpdateRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { url, method, body, header, parameters, responses } = req.body;
        const { userId } = req.user;

        if ((method && !["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].includes(method)) || method === "") {
            return res.status(400).json({ message: "Invalid method" });
        }

        // Vérifier si l'URL est valide

        if (url && !new URL(url)) {
            return res.status(400).json({ message: "Invalid URL" });
        }

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

        // Vérifier si l'utilisateur a le grade viewer dans la collection ou workspace
        var userConnectedInCollection = collection.users.find(u => u.userId.toString() === userId.toString());

        const workspaceConnectedUser = await Workspace.findOne({ collections: request.collectionId, "users.userId": userId });
        if (!workspaceConnectedUser) return res.status(404).json({ message: "User not found in workspace" });

        if (!userConnectedInCollection) {
            userConnectedInCollection = workspaceConnectedUser.users.find(u => u.userId.toString() === userId.toString());
        }
        if (!userConnectedInCollection) return res.status(404).json({ message: "User not found in collection or workspace" });

        if (userConnectedInCollection.privilege < viewer_grade) return res.status(403).json({ message: "User not authorized" });

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
        request.requests.push({paramRequestId: newParamRequest._id, userId: userId});
        await request.save();

        return res.status(201).json({ paramRequest: newParamRequest });
    } catch (error) {
        return res.status(500).json({ message: error.message });
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

        var userConnectedInCollection = collection.users.find(u => u.userId.toString() === userId.toString());

        const workspaceConnectedUser = await Workspace.findOne({ collections: request.collectionId, "users.userId": userId });
        if (!workspaceConnectedUser) return res.status(404).json({ message: "User not found in workspace" });

        if (!userConnectedInCollection) {
            userConnectedInCollection = workspaceConnectedUser.users.find(u => u.userId.toString() === userId.toString());
        }
        if (!userConnectedInCollection) return res.status(404).json({ message: "User not found in collection or workspace" });


        if (userConnectedInCollection.privilege < admin_grade) return res.status(403).json({ message: "User not authorized" });

        await Request.findByIdAndDelete(requestId);
        await Collection.findByIdAndUpdate(collection._id, { $pull: { requests: requestId } });
        await ParamRequest.deleteMany({ requestId });
        return res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
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

        var userConnectedInCollection = collection.users.find(u => u.userId.toString() === userId.toString());

        const workspaceConnectedUser = await Workspace.findOne({ collections: request.collectionId, "users.userId": userId });
        if (!workspaceConnectedUser) return res.status(404).json({ message: "User not found in workspace" });

        if (!userConnectedInCollection) {
            userConnectedInCollection = workspaceConnectedUser.users.find(u => u.userId.toString() === userId.toString());
        }
        if (!userConnectedInCollection) return res.status(404).json({ message: "User not found in collection or workspace" });
        
        if (userConnectedInCollection.privilege < admin_grade && userConnectedInCollection.userId !== paramRequest.userId) return res.status(403).json({ message: "User not authorized" });

        await ParamRequest.findByIdAndDelete(paramRequestId);
        await Request.findByIdAndUpdate(request._id, { $pull: { requests: { paramRequestId } } });

        return res.status(200).json({ message: "ParamRequest deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getLastParamRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        if (!requestId) {
            return res.status(400).json({ message: "Request ID is required" });
        }

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const lastParamRequest = await ParamRequest.findOne({ requestId }).sort({ createdAt: -1 });
        if (!lastParamRequest) {
            return res.status(404).json({ message: "ParamRequest not found" });
        }

        return res.status(200).json({ paramRequest: lastParamRequest });

    } catch (error) {
        return res.status(500).json({ message: error.message });
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