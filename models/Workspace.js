import mongoose from "mongoose";

// UserId and privilege with disabled id
const UserAndPrivilegeAndHasJoined = new mongoose.Schema({
    UserId: { 
        type: String, 
        required: true 
    },
    privilege: { 
        type: Number, 
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
        default: "untilted",
    }
},
    {timestamps: true}
);

const Workspace = mongoose.model("Workspace", WorkspaceSchema);
export default Workspace;