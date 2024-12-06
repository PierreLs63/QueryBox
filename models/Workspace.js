import mongoose from "mongoose";


// UserId and privilege with disabled id
const UserAndPrivilegeAndHasJoined = new Schema({
    UserId: { 
        type: String, 
        required: true 
    },
    privilege: { 
        type: int, 
        required: true 
    },
    hasJoined: {
        type: Boolean,
        default: false
    }
  }, { _id: false });


const WorkspaceSchema = new mongoose.Schema({
    collections: [{ type: String }],
    users: [UserAndPrivilegeAndHasJoined], 
    name: {
        type: String,
        required: true,
    }
},
    {timestamps: true}
);

const Workspace = mongoose.model("Workspace", WorkspaceSchema);
export default Workspace;