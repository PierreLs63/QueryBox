import Response from '../models/Response';
import Request from '../models/Request';
import ParamRequest from '../models/ParamRequest';
import Workspace from '../models/Workspace';
import Collection from '../models/Collection';

dotenv.config();
const admin_grade = process.env.ADMIN_GRADE || 20;
const viewer_grade = process.env.VIEWER_GRADE || 10;

export const createRequest = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { userId } = req.user;

        const user = await Collection.findOne({ _id: collectionId, "users.UserId": userId });
        
        if (!user) {
            return res.status(404).json({ message: "User not found in collection" });
        }
        
        if (user.users.find(u => u.UserId === userId).privilege < viewer_grade) {
            return res.status(401).json({ message: "User not authorized" });
        }

        const request = new Request({ name: "Untitled Request", collectionId: collectionId });
        await request.save();
        res.status(201).json(request);
    } catch (error) {
        res.status(409).json({ message: error.message }); 
    }
}

export const changeName = async (req, res) => {
    try {
        const { requestId, name} = req.params;
        const { userId } = req.user;

        const request = await Request.findOne({ _id: requestId, "requests.userId": userId });

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        
        const collection = await Collection.findById(request.collectionId);
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        const userInCollection = collection.users.find(userInCollection => userInCollection.UserId.toString() === userId.toString());
        if (!userInCollection || userInCollection.privilege < viewer_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to change the name of the request" });
        }
        request.name = name;
        await request.save();
        res.status(200).json(request);
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

        const collection = await Collection.findById(request.collectionId);
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        const userInCollection = collection.users.find(userInCollection => userInCollection.UserId.toString() === userId.toString());
        if (!userInCollection || userInCollection.privilege < viewer_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to change the name of the request" });
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

        res.status(201).json(newParamRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { userId } = req.user;

        const request = await Request.findOne({ _id: requestId, "requests.userId": userId });
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const collection = await Collection.findById(request.collectionId);
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        const userInCollection = collection.users.find(userInCollection => userInCollection.UserId.toString() === userId.toString());
        if (!userInCollection || userInCollection.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to change the name of the request" });
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
            return res.status(403).json({ message: "You don't have the required privileges to change the name of the request" });
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

        const collection = await Collection.findById(collectionId);
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        const userInCollection = collection.users.find(userInCollection => userInCollection.UserId.toString() === userId.toString());
        if (!userInCollection) {
            return res.status(404).json({ message: "User not found in collection" });
        }
        const requests = await Request.find({ collectionId: collectionId });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}