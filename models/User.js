import mongoose from "mongoose";
import randToken from "rand-token";

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
            return randToken.generate(64);
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