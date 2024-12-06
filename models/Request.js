import mongoose from "mongoose";


// UserId and privilege with disabled id
const requestandUserIdandParamSchema = new Schema({
    paramRequestId: { 
        type: String, 
        required: true 
    },
    userId: { 
        type: String, 
        required: true 
    }
  }, { _id: false });


const RequestSchema = new mongoose.Schema({
    requests: [requestandUserIdandParamSchema], 
    name: {
        type: String,
        required: true,
    },
    collectionId: {
        type: String,
        required: true
    }
},
    {timestamps: true}
);

const Request = mongoose.model("Request", RequestSchema);
export default Request;