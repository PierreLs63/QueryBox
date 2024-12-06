import mongoose from "mongoose";


// Key value structure to be implemented in header with disabled id
const KeyValueSchema = new Schema({
    key: { type: String, required: true },
    value: { type: String, required: true }
  }, { _id: false });


const CollectionSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
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
        type: String,
        required: true
    },
    header: [KeyValueSchema], // Array of key-value pairs
    parameters: [KeyValueSchema], // Array of key-value pairs
    responses: [{type: String}],
},
    {timestamps: true}
);

const Collection = mongoose.model("Collection", CollectionSchema);
export default Collection;