import mongoose from "mongoose";

// UserId and privilege with disabled id
const UserAndPrivilegeAndHasJoined = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User'
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
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
    users: [UserAndPrivilegeAndHasJoined], 
    name: {
        type: String,
        default: "Untitled Workspace",
    }
},
    {timestamps: true}
);

const Workspace = mongoose.model("Workspace", WorkspaceSchema);
export default Workspace;