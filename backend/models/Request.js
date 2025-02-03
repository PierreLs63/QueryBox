import mongoose from "mongoose";

// UserId and privilege with disabled id
const requestandUserIdandParamSchema = new mongoose.Schema({
    paramRequestId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "ParamRequest" 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "User" 
    }
  }, { _id: false });


const RequestSchema = new mongoose.Schema({
    requests: [requestandUserIdandParamSchema], 
    name: {
        type: String,
        required: true,
    },
    collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Collection"
    }
},
    {timestamps: true}
);

const Request = mongoose.model("Request", RequestSchema);
export default Request;