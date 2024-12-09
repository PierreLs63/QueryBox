import Workspace from "../models/Workspace.js";
import User from "../models/User.js";

dotenv.config();
const admin_grade = process.env.ADMIN_GRADE || 20;
const viewer_grade = process.env.VIEWER_GRADE || 10;


export const createWorkspace = async (req,res) => {
    try {
        const { userId } = req.user;
        const newWorkspace = new Workspace({
            users: [{
                userId,
                privilege: admin_grade,
                hasJoined:true
            }]
        });
        await newWorkspace.save();
        res.status(201).json(newWorkspace);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const changeName = async (req,res) => {
    try {
        const { workspaceId , name} = req.params;
        const { userId } = req.user;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }
        const userInWorkspace = workspace.users.find(userInWorkspace => userInWorkspace.userId.toString() === userId.toString());
        if(!userInWorkspace) {
            return res.status(404).json({message: "User not in workspace"});
        }
        if(userInWorkspace.privilege < admin_grade || userInWorkspace.hasJoined === false) {
            return res.status(403).json({message: "You don't have the required privileges to change the name of the workspace"});
        }
        const updatedWorkspace = await Workspace.findByIdAndUpdate
        (workspaceId, {name}, {new: true});
        res.status(200).json(updatedWorkspace);


    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const deleteWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { userId } = req.user;
        const user = await  User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }
        const userInWorkspace = workspace.users.find(userInWorkspace => userInWorkspace.userId.toString() === userId.toString());
        if(!userInWorkspace) {
            return res.status(404).json({message: "User not in workspace"});
        }
        if(userInWorkspace.privilege < admin_grade || userInWorkspace.hasJoined === false) {
            return res.status(403).json({message: "You don't have the required privileges to delete the workspace"});
        }
        await Workspace.findByIdAndDelete(workspaceId);
        res.status(200).json({message: "Workspace deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const removeUserBFromWorkspaceFromUserA = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { userId } = req.user;
        const { username } = req.body;
        
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }
        const userInWorkspace = workspace.users.find(userInWorkspace => userInWorkspace.userId.toString() === userId.toString());
        if(!userInWorkspace) {
            return res.status(404).json({message: "User not in workspace"});
        }
        if(userInWorkspace.userId.toString() === userId.toString() && !username) {
            const updatedWorkspace = await Workspace.findByIdAndUpdate
            (workspaceId, { $pull: { users: { userId: user._id } } }, {new: true});
            return res.status(200).json(updatedWorkspace);
        }
        if(userInWorkspace.privilege < admin_grade || userInWorkspace.hasJoined === false) {
            return res.status(403).json({message: "You don't have the required privileges to remove a user"});
        }
        const userToRemove = await User.findById(username);
        if(!userToRemove) {
            return res.status(404).json({message: "User not found"});
        }
        const updatedWorkspace = await Workspace.findByIdAndUpdate
        (workspaceId, { $pull: { users: { userId: userToRemove._id } } }, {new: true});
        res.status(200).json(updatedWorkspace);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updatePrivileges = async (req,res) => {
    try {
        const { workspaceId } = req.params;
        const { userId } = req.user;
        const { username, level } = req.body;

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }
        const userInWorkspace = workspace.users.find(userInWorkspace => userInWorkspace.userId.toString() === userId.toString());
        if(!userInWorkspace) {
            return res.status(404).json({message: "User not in workspace"});
        }
        if(userInWorkspace.privilege < admin_grade || userInWorkspace.hasJoined === false) {
            return res.status(403).json({message: "You don't have the required privileges to update a user"});
        }
        const userToUpdate = await User.findOne({username});
        if(!userToUpdate) {
            return res.status(404).json({message: "User not found"});
        }
        const updatedWorkspace = await Workspace.findOneAndUpdate
        ({_id: workspaceId, "users.userId": userToUpdate._id}, { $set: { "users.$.privilege": level } }, {new: true});  
        res.status(200).json(updatedWorkspace);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getAllCollection = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { userId } = req.user;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }
        const userInWorkspace = workspace.users.find(userInWorkspace => userInWorkspace.userId.toString() === userId.toString());
        if(!userInWorkspace || userInWorkspace.privilege < viewer_grade || userInWorkspace.hasJoined === false) {
            return res.status(403).json({message: "You don't have the required privileges to get the collections"});
        }
        res.status(200).json(workspace.collections);
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const inviteUserByUsername = async (req, res) => {
    try {
        const { workspaceId, username, level} = req.params;
        const { userId } = req.user;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }
        const userInWorkspace = workspace.users.find(userInWorkspace => userInWorkspace.userId.toString() === userId.toString());
        if(!userInWorkspace) {
            return res.status(404).json({message: "User not in workspace"});
        }
        if(userInWorkspace.privilege < admin_grade || userInWorkspace.hasJoined === false) {
            return res.status(403).json({message: "You don't have the required privileges to invite a user"});
        }
        const userToInvite = await User.findOne({username});
        if(!userToInvite) {
            return res.status(404).json({message: "User not found"});
        }
        const userAlreadyInWorkspace = workspace.users.find(userInWorkspace => userInWorkspace.userId.toString() === userToInvite._id.toString());
        if(userAlreadyInWorkspace) {
            return res.status(403).json({message: "User already in workspace"});
        }
        const newWorkspace = await Workspace
        .findById
        (workspaceId, function(err, doc) {
            doc.users.push({userId: userToInvite._id, privilege: level || viewer_grade, hasJoined: false});
            doc.save();
        });
        res.status(200).json(newWorkspace);
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const joinWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { userId } = req.user;
        const user = await User.findById (userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }
        const userInWorkspace = workspace.users.find(userInWorkspace => userInWorkspace.userId.toString() === userId.toString());
        if(!userInWorkspace) {
            return res.status(404).json({message: "User not in workspace"});
        }
        if(userInWorkspace.hasJoined === true) {
            return res.status(403).json({message: "User already joined"});
        }
        const updatedWorkspace = await Workspace.findOneAndUpdate
        ({_id: workspaceId, "users.userId": user._id}, { $set: { "users.$.hasJoined": true } }, {new: true});
        res.status(200).json(updatedWorkspace);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
}