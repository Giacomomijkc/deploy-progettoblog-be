const mongoose = require('mongoose');

const AuthorModelSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    surname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    dateOfBirth:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        required: false
    },
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "POST",
            default: []
        }
    ]
}, { timestamps: true, strict: true });

module.exports = mongoose.model("AUTHOR", AuthorModelSchema, "authors");