import Collection from '../models/Collection.js';
import Workspace from '../models/Workspace.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();
const admin_grade = process.env.ADMIN_GRADE || 20;
const viewer_grade = process.env.VIEWER_GRADE || 10;

export const createCollection = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { userId } = req.user;

        const user = await Workspace.findOne({ _id: workspaceId, "users.userId": userId });
        // Si l'utilisateur n'est pas dans le workspace
        if (!user) return res.status(404).json({ message: "User not found in workspace" });
        // Si l'utilisateur n'a pas les droits de lecture et écriture dans le workspace
        if (user.users.find(u => u.userId == userId).privilege < viewer_grade) return res.status(403).json({ message: "User not authorized" });

        const collection = new Collection({ name: "Untitled Collection", workspaceId: workspaceId, users: [{ userId: userId, privilege: 20 }] });
        await collection.save();

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        workspace.collections.push(collection._id);
        await workspace.save();
        
        res.status(201).json(collection);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const deleteCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { userId } = req.user;

        const collection = await Collection.findById(collectionId);
        if (!collection) return res.status(404).json({ message: "Collection not found" });

        const user = collection.users.find(u => u.userId == userId);
        if (!user || user.privilege < admin_grade) return res.status(403).json({ message: "User not authorized" });

        await Collection.findByIdAndDelete(collectionId);
        res.status(200).json({ message: "Collection deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllRequestsFromCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { userId } = req.user;

        const collection = await Collection.findById(collectionId);
        if (!collection) return res.status(404).json({ message: "Collection not found" });

        const user = collection.users.find(u => u.userId == userId);
        if (!user|| user.privilege < viewer_grade) return res.status(403).json({ message: "User not authorized" });
        await collection.populate('requests');
        // On envoie les données de toutes les requêtes de la collection et non pas juste un tableau d'ids
        res.status(200).json(collection.requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const changeCollectionName = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { userId } = req.user;
        const { name } = req.body;

        if (!name) return res.status(400).json({ message: "Missing data" });

        const collection = await Collection.findById(collectionId);
        if (!collection) return res.status(404).json({ message: "Collection not found" });

        const user = collection.users.find(u => u.userId == userId);
        if (!user || user.privilege < admin_grade) return res.status(403).json({ message: "User not authorized" });

        // Si le nom de la collection est différent du nouveau nom
        if (collection.name !== name) {
            collection.name = name;
            await collection.save();
        }

        res.status(200).json({message: "Collection name updated successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updatePrivileges = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const userConnectedId = req.user.userId;
        const { username, privilege } = req.body;

        if (!username || !privilege || typeof privilege !== "number" || typeof username !== "string" ) return res.status(400).json({ message: "Missing or invalid data" })

        const collection = await Collection.findById(collectionId);
        if (!collection) return res.status(404).json({ message: "Collection not found" });

        const user = collection.users.find(u => u.userId == userConnectedId);
        if (!user || user.privilege < admin_grade) return res.status(403).json({ message: "User not authorized" });

        const userToUpdate = await User.findOne({ username: username }).collation({ locale: 'en', strength: 2 }).lean()
        if (!userToUpdate) return res.status(404).json({ message: "User to update not found" });

        const foundUser = collection.users.find(u => u.userId == userToUpdate._id);
        if (!foundUser) return res.status(404).json({ message: "User to update not found in collection" });

        foundUser.privilege = privilege;

        await collection.save();

        res.status(200).json({ message: "User privileges updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
