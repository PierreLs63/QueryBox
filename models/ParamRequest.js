import mongoose from "mongoose";

// Key value structure to be implemented in header with disabled id
const KeyValueSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: String, required: true }
  }, { _id: false });


const ParamRequestSchema = new mongoose.Schema({
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Request"
    },
    url: {
        type: String,
        default: ""
    },
    method: {
        type: String,
        default: "GET"
    },
    body: {
        type: String,
        default: ""
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    header: [KeyValueSchema], // Array of key-value pairs
    parameters: [KeyValueSchema], // Array of key-value pairs
    responses: [{type: mongoose.Schema.Types.ObjectId, ref: "Response"}],
},
    {timestamps: true}
);

const ParamRequest = mongoose.model("ParamRequest", ParamRequestSchema);
export default ParamRequest;