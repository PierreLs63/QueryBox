import Workspace from "../models/Workspace.js";

export const create = async (req,res) => {
    try {
        const { name } = req.body;
        const newWorkspace = new Workspace({
            
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}