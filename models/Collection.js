import mongoose from "mongoose";

// UserId and privilege with disabled id
const UserAndPrivilege = new mongoose.Schema({
    UserId: { 
        type: String, 
        required: true 
    },
    privilege: { 
        type: Number, 
        required: true 
    }
  }, { _id: false });


const CollectionSchema = new mongoose.Schema({
    //this array of strings are requestIds
    requests: [{ type: String }],
    users: [UserAndPrivilege], 
    name: {
        type: String,
        required: true,
    },
    workspaceId: {
        type: String,
        required: true
    }
},
    {timestamps: true}
);

const Collection = mongoose.model("Collection", CollectionSchema);
export default Collection;