const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  quoteTitle: {
    type: String,
    required: true,
    trim: true,
  },
  clicked: {
    type: Boolean,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
