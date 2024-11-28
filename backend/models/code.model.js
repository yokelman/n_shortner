// importing mongoose library
import mongoose from "mongoose";

// code schema => {owner,value,redirect == all required}
const CodeSchema = mongoose.Schema({
    owner:{
        type: String,
        required: true
    },
    value:{
        type: Number,
        required: true
    },
    redirect:{
        type: String,
        required: true
    },
    visibility:{
        type: String,
        required: true
    },
    note:{
        type: String,
        required: true
    }
});

// mongoose model
const Code = mongoose.model("Code",CodeSchema);

// export the model
export default Code;