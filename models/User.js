import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 32,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        max: 320
    },
    password: {
        type: String,
        required: true,
        min: 8,   
    },
    token: {
        type: String,
        default: function() {
            return crypto.randomUUID();
        }
    },
    isValid: {
        type: Boolean,
        default: false,
    }
},
    {timestamps: true}
);

const User = mongoose.model("User", UserSchema);
export default User;