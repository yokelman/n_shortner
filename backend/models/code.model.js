// importing mongoose library
import mongoose from "mongoose";

// code schema => {owner,value,redirect == all required}
const CodeSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    redirect: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    preview: {
        type: String,
        required: false
    }
});

// mongoose model
const Code = mongoose.model("Code", CodeSchema);

// export the model
export default Code;