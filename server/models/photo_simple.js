// Holds photo information
// This is from web lab catbook server dir schema
//1/12/21 22:30 for debugging

const mongoose = require("mongoose");

//define a comment schema for the database
const PhotoSimpleSchema = new mongoose.Schema({
  caption_text_s: String, //This holds the thoughts on the photo that are not tags
  tag_text_s: String,
  photo_placeholder: String,
  difficulty: Number,
  quality: Number,
  uname: String,
  uid: String,
});

// compile model from schema
module.exports = mongoose.model("photo_simple", PhotoSimpleSchema);
