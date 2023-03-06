const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentId: {
    type: Number
  },
  usersId: {
    type: Number
  },
  postId: {
    type: Number
  },
  nickname: {
    type: String
  },
  comment: {
    type: String,
    required: true
  }
  },
    {
        timestamps: true
    });

module.exports = mongoose.model("Comment", commentSchema);