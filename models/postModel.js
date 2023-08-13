const mongoose = require('mongoose')

const PostModelSchema = new mongoose.Schema({
    category:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    readTime:{
      value:{
        type: Number,
        required: false
      },
      unit:{
        type: String,
        required: false
      },
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "AUTHOR"
    },
    content:{
        type: String,
        required: true
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "COMMENT",
        default: []
      }
    ]
}, {timestamps: true, strict:true})

module.exports = mongoose.model("POST", PostModelSchema, "posts");