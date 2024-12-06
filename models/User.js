import mongoose from "mongoose";
import randToken from "rand-token";

const UserSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        min: 3,
        max: 32,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        max: 32,
    },
    password: {
        type: String,
        required: true,
        min: 6,   
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