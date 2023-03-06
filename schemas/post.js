const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const postSchema = new mongoose.Schema({
  postId: {
    type: Number
  },
  usersId: {
    type: Number
  },
  nickname: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }  

},
{
    timestamps: true
});
// postSchema.plugin(AutoIncrement, {inc_filed: "postId" })

module.exports = mongoose.model("Post", postSchema);