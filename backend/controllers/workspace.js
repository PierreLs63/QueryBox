import mongoose from "mongoose";
import Workspace from "../models/Workspace.js";
import Collection from "../models/Collection.js";
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
                userId: userId,
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

        const userInWorkspace = workspace.users.find(user => user.userId.toString() === userId.toString());
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

        const userInWorkspace = workspace.users.find(user => user.userId.toString() === userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to delete the workspace" });
        }

        await Workspace.deleteOne({ _id: workspaceId });
        await User.updateMany({ "workspaces.workspaceId": workspaceId }, { $pull: { workspaces: { workspaceId } } });
        await Collection.deleteMany({ workspaceId });
        res.status(200).json({ message: "Workspace deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const removeUserBFromWorkspaceFromUserA = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { username } = req.body;
        const { userId } = req.user;

        if (!username) return res.status(400).json({ message: "Missing data" });

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userInWorkspace = workspace.users.find(user => user.userId.toString() === userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to remove a user from the workspace" });
        }
        // On cherche l'utilisateur à retirer dans la base de données sans le mot de passe
        const userToSearch = await User.findOne({ username }).select("-password").collation({ locale: 'en', strength: 2 });
        if (!userToSearch) return res.status(404).json({ message: "User to remove not found" });

        const userToRemove = workspace.users.find(u => u.userId.toString() === userToSearch._id.toString());
        if (!userToRemove) return res.status(404).json({ message: "User to remove not found in workspace" });

        // Si l'utilisateur à retirer est l'utilisateur actuel, on ne peut pas le retirer
        if (userInWorkspace.userId === userToRemove.userId) {
            return res.status(403).json({ message: "You can't remove yourself from the workspace with this endpoint" });
        }
        // Si l'utilisateur à retirer est le propriétaire, on ne peut pas le retirer
        if (userToRemove.privilege === owner_grade) {
            return res.status(403).json({ message: "You can't remove the owner of the workspace" });
        }

         // Si l'utilisateur à retirer est un administrateur, on ne peut pas le retirer en tant qu'admin, il faut être le propriétaire
        if (userToRemove.privilege === admin_grade && userInWorkspace.privilege < owner_grade) {
            return res.status(403).json({ message: "You can't remove an admin from the workspace as an admin, only the owner can" });
        }

        workspace.users = workspace.users.filter(user => user.userId.toString() !== userToRemove.userId.toString());

        await workspace.populate("collections");

        // Si l'utilisateur a quitté le workspace, on le retire également de toutes les collections
        for (let collection of workspace.collections) {
            collection.users = collection.users.filter(user => user.userId.toString() !== userToRemove.userId.toString());
            await collection.save();
        }

        await workspace.save();

        res.status(200).json({ message: "User removed from workspace successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updatePrivileges = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { username, privilege } = req.body;
        const { userId } = req.user;

        if (!username || !privilege || typeof privilege !== "number" ) return res.status(400).json({ message: "Missing data" });

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userInWorkspace = workspace.users.find(user => user.userId.toString() === userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to update user privileges" });
        }

        const userToUpdate = await User.findOne({ username: username }).select("-password").collation({ locale: 'en', strength: 2 })
        if (!userToUpdate) return res.status(404).json({ message: "User to update not found" });

        
        const foundUser = workspace.users.find(u => u.userId.toString() === userToUpdate._id.toString());
        if (!foundUser) return res.status(404).json({ message: "User to update not found in workspace" });

        if (foundUser.privilege === admin_grade && userInWorkspace.privilege < owner_grade) {
            return res.status(403).json({ message: "You can't update the privileges of an admin as an admin" });
        }

        if (foundUser.privilege === owner_grade) {
            return res.status(403).json({ message: "You can't update the privileges of the owner" });
        }
        
        if (userInWorkspace.privilege === owner_grade && privilege === owner_grade) {
            userInWorkspace.privilege = admin_grade; // On transfère le grade de propriétaire à cette personne, il y a qu'un seul owner
        }

        foundUser.privilege = privilege;

        await workspace.populate("collections");

        // Si l'utilisateur a ses privilèges modifié le workspace, on reset également le privilège de toutes les collections
        for (let collection of workspace.collections) {
            collection.users = collection.users.filter(user => user.userId.toString() !== userToUpdate._id.toString());
            await collection.save();
        }

        await workspace.save();

        res.status(200).json({ message: "User privileges updated successfully" });
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
        await workspace.populate("collections");
        return res.status(200).json(workspace.collections);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const inviteUserByUsername = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { username, privilege } = req.body;
        const { userId } = req.user;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userInWorkspace = workspace.users.find(user => user.userId.toString() === userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to invite a user" });
        }

        const userToInvite = await User.findOne({ username }).select("-password").collation({ locale: 'en', strength: 2 });
        if (!userToInvite) {
            return res.status(404).json({ message: "User not found" });
        }

        const userAlreadyInWorkspace = workspace.users.find(user => user.userId.toString() === userToInvite._id.toString());
        if (userAlreadyInWorkspace) {
            return res.status(403).json({ message: "User already in workspace or invited" });
        }

        if (privilege && typeof privilege !== "number") {
            return res.status(400).json({ message: "Invalid typeof privilege" });
        }

        if (privilege && (privilege < viewer_grade || privilege > admin_grade)) {
            return res.status(400).json({ message: "Invalid privilege" });
        }

        workspace.users.push({ userId: userToInvite._id, privilege: privilege || viewer_grade, hasJoined: false });
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

        if (userInWorkspace.hasJoined === true) {
            return res.status(403).json({ message: "User already joined workspace" });
        }

        userInWorkspace.hasJoined = true;
        await workspace.save();

        return res.status(200).json({ message: "You joined the workspace : " + workspace.name });
    } catch (error) {
        return res.status(500).json({ message: error.message });
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

        if (userInWorkspace.privilege === owner_grade) {
            return res.status(403).json({ message: "Owner can't leave workspace, please transfer your ownership before leaving" });
        }

        workspace.users = workspace.users.filter(user => user.userId.toString() !== userId.toString());

        await workspace.populate("collections");

        // Si l'utilisateur a quitté le workspace, on le retire également de toutes les collections
        for (let collection of workspace.collections) {
            collection.users = collection.users.filter(user => user.userId.toString() !== userId.toString());
            await collection.save();
        }

        await workspace.save();

        res.status(200).json({ message: "User left workspace successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUsersInWorkspace = async (req, res) => {
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
       
        await workspace.populate({path:"users.userId", select: "username"});
        const users = workspace.users.map(user => ({
            userId: user.userId._id,       // Keep the userId
            username: user.userId.username, // Extract the username
            privilege: user.privilege,
            hasJoined: user.hasJoined
        }));
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getWorkspaces = async (req, res) => {
    try {
        const { userId } = req.user;
        const workspaces = await Workspace.find({ users: { $elemMatch: { userId: userId, hasJoined: true } } });
        const filteredWorkspaces = workspaces.map(workspace => ({ id: workspace._id, name: workspace.name}));
        return res.status(200).json(filteredWorkspaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getWorkspacesInvited = async (req, res) => {
    try {
        const { userId } = req.user;
        const workspaces = await Workspace.find({ users: { $elemMatch: { userId: userId, hasJoined: false } } });
        const filteredWorkspaces = workspaces.map(workspace => ({ id: workspace._id, name: workspace.name}));
        return res.status(200).json(filteredWorkspaces);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
    
export const getWorkspaceById = async (req, res) => {
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
        return res.status(200).json(workspace);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
