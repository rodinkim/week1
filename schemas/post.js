const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
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

module.exports = mongoose.model("Post", postSchema);