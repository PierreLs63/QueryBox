import mongoose from "mongoose";
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
        const { username } = req.body;
        const { userId } = req.user;

        if (!username) return res.status(400).json({ message: "Missing data" });

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const userInWorkspace = workspace.users.find(user => user.userId.toString() == userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to remove a user from the workspace" });
        }

        const userToSearch = await User.findOne({ username: username }).collation({ locale: 'en', strength: 2 }).lean()
        if (!userToSearch) return res.status(404).json({ message: "User to remove not found" });

        console.log(userToSearch)
        const userToRemove = workspace.users.find(u => u.userId.toString() == userToSearch._id.toString());
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

        workspace.users = workspace.users.filter(user => user.userId != userToRemove.userId);
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

        const userInWorkspace = workspace.users.find(user => user.userId.toString() == userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to update user privileges" });
        }

        const userToUpdate = await User.findOne({ username: username }).collation({ locale: 'en', strength: 2 }).lean()
        if (!userToUpdate) return res.status(404).json({ message: "User to update not found" });

        
        const foundUser = workspace.users.find(u => u.userId == userToUpdate._id);
        if (!foundUser) return res.status(404).json({ message: "User to update not found in workspace" });

        if (foundUser.privilege === admin_grade && userInWorkspace.privilege < owner_grade) {
            return res.status(403).json({ message: "You can't update the privileges of an admin as an admin" });
        }

        if (userInWorkspace.privilege === owner_grade && privilege === owner_grade) {
            userInWorkspace.privilege = admin_grade; // On transfère le grade de propriétaire à cette personne, il y a qu'un seul owner
        }

        if (foundUser.privilege === owner_grade) {
            return res.status(403).json({ message: "You can't update the privileges of the owner" });
        }

        foundUser.privilege = privilege;
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

        const userInWorkspace = workspace.users.find(user => user.userId.toString() == userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < viewer_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to view the collections" });
        }
        await workspace.populate("collections");
        res.status(200).json(workspace.collections);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        const userInWorkspace = workspace.users.find(user => user.userId.toString() == userId.toString());
        if (!userInWorkspace || userInWorkspace.privilege < admin_grade) {
            return res.status(403).json({ message: "You don't have the required privileges to invite a user" });
        }

        const userToInvite = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });
        if (!userToInvite) {
            return res.status(404).json({ message: "User not found" });
        }

        const userAlreadyInWorkspace = workspace.users.find(user => user.userId.toString() == userToInvite._id.toString());
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

        const userInWorkspace = workspace.users.find(user => user.userId.toString() == userId.toString());
        if (!userInWorkspace) {
            return res.status(404).json({ message: "User not invited to workspace" });
        }

        if (userInWorkspace.hasJoined) {
            return res.status(403).json({ message: "User already joined workspace" });
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

        const userInWorkspace = workspace.users.find(user => user.userId.toString() == userId.toString());
        if (!userInWorkspace) {
            return res.status(404).json({ message: "User not found in workspace" });
        }

        if (userInWorkspace.privilege === owner_grade) {
            return res.status(403).json({ message: "Owner can't leave workspace, please transfer your ownership before leaving" });
        }

        workspace.users = workspace.users.filter(user => user.userId.toString() != userId.toString());
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
        const userInWorkspace = workspace.users.find(user => user.userId.toString() == userId.toString());
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
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getWorkspaces = async (req, res) => {
    try {
        const { userId } = req.user;
        const workspaces = await Workspace.find();
        const workspacesUser = workspaces.filter(workspace => workspace.users.find(user => user.userId.toString() == userId.toString()));
        const filteredWorkspaces = workspacesUser.map(workspace => ({
            id: workspace._id,
            name: workspace.name
        }));
        res.status(200).json(filteredWorkspaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
    
