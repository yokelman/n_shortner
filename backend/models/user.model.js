// importing mongoose
import mongoose from "mongoose";

// userschema => (username,password both required)
const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

// mongoose model
const User = mongoose.model("User",UserSchema);

// exporting model
export default User;