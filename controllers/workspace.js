import Workspace from "../models/Workspace.js";
import User from "../models/User.js";

dotenv.config();
const admin_grade = process.env.ADMIN_GRADE || 20;
const viewer_grade = process.env.VIEWER_GRADE || 10;


export const createWorkspace = async (req,res) => {
    try {
        const { userId } = req.body;
        const newWorkspace = new Workspace({
            users: [{
                userId,
                privilege:20
            }]
        });
        await newWorkspace.save();
        res.status(201).json({
            workspaceId: newWorkspace._id,
            name: newWorkspace.name
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const changeName = async (req,res) => {
    try {
        const { workspaceId , name} = req.params;
        const workspace = await Workspace.findByIdAndUpdate(workspaceId, {name}, {new: true});
        if(!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }
        res.status(200).json(workspace);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const deleteWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const workspace = await Workspace.findByIdAndDelete(workspaceId);
        if(!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }
        res.status(200).json({message: "Workspace deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const removeUserBFromWorkspaceFromUserA = async (req, res) => {
    try {
        const { userId, workspaceId } = req.params;
        const { pseudo } = req.body;

        const userToBeRemovedId = await User.findOne({ pseudo }).select("_id");
        if(!userToBeRemovedId) {
            return res.status(404).json({message: "User not found"});
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }

        if(userToBeRemovedId !== userId && user.privileges < admin_grade) {
            return res.status(403).json({message: "You don't have the required privileges to remove another user"});
        }
        await User.findByIdAndUpdate(userToBeRemovedId, {workspace: null}, {new: true});
        res.status(200).json({message: "User removed from workspace"});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updatePrivileges = async (req,res) => {
    try {
        const { userId, workspaceId } = req.params;
        const { pseudo, level } = req.body;

        let userToBePrivilegedId;
        if(pseudo!==undefined){
            userToBeUpdatedId = await User.findOne({ pseudo }).select("_id");
            if(!userToBePrivilegedId) {
                return res.status(404).json({message: "User not found"});
            }
        }
        else{
            userToBePrivilegedId = userId;
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }
        if(userToBePrivilegedId !== userId && user.privileges >= admin_grade) {
            await User.findByIdAndUpdate(userToBePrivilegedId, {privileges: level}, {new:true});
            res.status(200).json({message: "Privileges updated"});
        } else {
            return res.status(403).json({message: "You don't have the required privileges to update another user"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getAllCollection = async (req, res) => {
    try {
        const { userId, workspaceId } = req.params;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }
        if(user.privileges >= viewer_grade) {
            const collections = await Workspace.findById(workspaceId).select("collections");
            res.status(200).json(collections);
        } else {
            return res.status(403).json({message: "You don't have the required privileges to access this workspace"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const inviteUserByPseudo = async (req, res) => {
    try {
        const { userId, workspaceId, pseudo, level} = req.params;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }
        if(user.privileges >= admin_grade) {
            const userToBeInvited = await User.findOne({pseudo});
            if(!userToBeInvited) {
                return res.status(404).json({message: "User not found"});
            }
            const newInvite = {
                userId: userToBeInvited._id,
                privilege: level || 0,
                hasJoined: false
            }
            workspace.invites.push(newInvite);
            await workspace.save();
            res.status(200).json({message: "User invited"});
        } else {
            return res.status(403).json({message: "You don't have the required privileges to invite a user"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}