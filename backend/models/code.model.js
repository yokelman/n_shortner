import mongoose from "mongoose";

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
    }
});

const Code = mongoose.model("Code",CodeSchema);

export default Code;