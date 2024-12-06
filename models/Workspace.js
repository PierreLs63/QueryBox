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


const CollectionSchema = new mongoose.Schema({
    collections: [{ type: String }],
    users: [UserAndPrivilegeAndHasJoined], 
    name: {
        type: String,
        required: true,
    }
},
    {timestamps: true}
);

const Collection = mongoose.model("Collection", CollectionSchema);
export default Collection;