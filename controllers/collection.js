import Collection from '../models/Collection.js';
import Workspace from '../models/Workspace.js';

export const createCollection = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { userId } = req.body;

        const user = await Workspace.findOne({ _id: workspaceId, "users.UserId": userId });
        // Si l'utilisateur n'est pas dans le workspace
        if (!user) return res.status(404).json({ message: "User not found in workspace" });
        // Si l'utilisateur n'a pas les droits de lecture et écriture dans le workspace
        if (user.users.find(u => u.UserId === userId).privilege < 10) return res.status(401).json({ message: "User not authorized" });

        const collection = new Collection({ name: "Untitled Collection", workspace: workspaceId, users: [{ UserId: userId, privilege: 20 }] });
        await collection.save();
        res.status(201).json(collection);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}