import mongoose from "mongoose";

// Key value structure to be implemented in header with disabled id
const KeyValueSchema = new mongoose.Schema({
    key: { type: String },
    value: { type: String }
  }, { _id: false });


const ResponseSchema = new mongoose.Schema({
    code: {
        type: Number,
        required: true,    
    },
    header: [KeyValueSchema], // Array of key-value pairs
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    body: {
        type: String,
        default:""
    },
    paramRequestId: {
        type: String,
        required: true
    }
},
    {timestamps: true}
);

const Response = mongoose.model("Response", ResponseSchema);
export default Response;