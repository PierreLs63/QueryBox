import Workspace from "../models/Workspace.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
const owner_grade = process.env.OWNER_GRADE || 30;
const admin_grade = process.env.ADMIN_GRADE || 20;
const viewer_grade = process.env.VIEWER_GRADE || 10;

export const createWorkspace = async (req, res) => {
    try {
        const { userId } = req.user;
        const newWorkspace = new Workspace({
            users: [{
                userId,
                privilege: owner_grade,
                hasJoined: true
            }]
        });
        await newWorkspace.save();
        res.status(201).json(newWorkspace);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const changeName = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { name } = req.body;
        const { userId } = req.user;

        if (!name) return res.status(400).json({ message: "Missing data" });

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userInWorkspace = workspace.users.find(user => user.userId.toString() == userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to change the name of the workspace" });
        }

        if (workspace.name !== name) {
            workspace.name = name;
            await workspace.save();
        }

        res.status(200).json({ message: "Workspace name updated successfully to : " + name});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { userId } = req.user;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userInWorkspace = workspace.users.find(user => user.userId.toString() == userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to delete the workspace" });
        }

        await Workspace.deleteOne({ _id: workspaceId });
        res.status(200).json({ message: "Workspace deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const removeUserBFromWorkspaceFromUserA = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { userBId } = req.body;
        const { userId } = req.user;

        if (!userBId) return res.status(400).json({ message: "Missing data" });

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userInWorkspace = workspace.users.find(user => user.userId.toString() == userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to remove a user from the workspace" });
        }

        // Si l'utilisateur à retirer est un administrateur, on ne peut pas le retirer en tant qu'admin, il faut être le propriétaire
        const userToRemove = workspace.users.find(user => user.userId.toString() == userBId.toString());
        if (userToRemove.privilege === admin_grade && userInWorkspace.privilege < owner_grade) {
            return res.status(403).json({ message: "You can't remove an admin from the workspace as an admin, only the owner can" });
        }

        workspace.users = workspace.users.filter(user => user.userId.toString() != userBId.toString());
        await workspace.save();
        res.status(200).json(workspace);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updatePrivileges = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { userToUpdateId, newPrivilege } = req.body;
        const { userId } = req.user;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userInWorkspace = workspace.users.find(user => user.userId.toString() === userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to update user privileges" });
        }

        const userToUpdate = workspace.users.find(user => user.userId.toString() === userToUpdateId.toString());
        if (!userToUpdate) {
            return res.status(404).json({ message: "User to update not found in workspace" });
        }

        userToUpdate.privilege = newPrivilege;
        await workspace.save();
        res.status(200).json(workspace);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllCollection = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { userId } = req.user;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userInWorkspace = workspace.users.find(user => user.userId.toString() === userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < viewer_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to view the collections" });
        }

        res.status(200).json(workspace.collections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const inviteUserByUsername = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { username, level } = req.body;
        const { userId } = req.user;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userInWorkspace = workspace.users.find(user => user.userId.toString() === userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to invite a user" });
        }

        const userToInvite = await User.findOne({ username });
        if (!userToInvite) {
            return res.status(404).json({ message: "User not found" });
        }

        const userAlreadyInWorkspace = workspace.users.find(user => user.userId.toString() === userToInvite._id.toString());
        if (userAlreadyInWorkspace) {
            return res.status(403).json({ message: "User already in workspace" });
        }

        workspace.users.push({ userId: userToInvite._id, privilege: level || viewer_grade, hasJoined: false });
        await workspace.save();

        res.status(200).json({ message: "User invited successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const joinWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { userId } = req.user;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userInWorkspace = workspace.users.find(user => user.userId.toString() === userId.toString());
        if (!userInWorkspace) {
            return res.status(404).json({ message: "User not invited to workspace" });
        }

        userInWorkspace.hasJoined = true;
        await workspace.save();

        res.status(200).json({ message: "User joined workspace successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const leaveWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { userId } = req.user;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userInWorkspace = workspace.users.find(user => user.userId.toString() === userId.toString());
        if (!userInWorkspace) {
            return res.status(404).json({ message: "User not found in workspace" });
        }

        workspace.users = workspace.users.filter(user => user.userId.toString() !== userId.toString());
        await workspace.save();

        res.status(200).json({ message: "User left workspace successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}