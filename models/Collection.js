import mongoose from "mongoose";


// UserId and privilege with disabled id
const UserAndPrivilege = new Schema({
    UserId: { 
        type: String, 
        required: true 
    },
    privilege: { 
        type: int, 
        required: true 
    }
  }, { _id: false });


const CollectionSchema = new mongoose.Schema({
    requests: [{ type: String }],
    users: [UserAndPrivilege], 
    name: {
        type: String,
        required: true,
    },
    workSpaceId: {
        type: String,
        required: true
    }
},
    {timestamps: true}
);

const Collection = mongoose.model("Collection", CollectionSchema);
export default Collection;