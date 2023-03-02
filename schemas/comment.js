const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
      },
    password: {
        type: String,
        required: true
      },
    contents: {
        type: String,
        required: true
      }  
    },
    {
        timestamps: true
    });

module.exports = mongoose.model("Comment", commentSchema);