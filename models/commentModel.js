const mongoose = require('mongoose');

const CommentModelSchema = new mongoose.Schema({
    rate:{
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 5
    },
    content:{
        type: String,
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "POST"
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"AUTHOR"
    }

}, {timestamps: true, strict: true});

module.exports = mongoose.model("COMMENT", CommentModelSchema, "comments");