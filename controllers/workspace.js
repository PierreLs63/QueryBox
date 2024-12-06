import Workspace from "../models/Workspace.js";

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
        res.status(500).json(error.message)
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
        res.status(500).json(error.message)
    }
}

export const deleteWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const workspace = await Workspace.findByIdAndDelete(workspaceId);
        if(!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }
        res.status(200).json({message: "Workspace deleted"}); //test
    } catch (error) {
        res.status(500).json(error.message)
    }
}