// Holds photo information
// This is from web lab catbook server dir schema
//1/12/21 22:30 for debugging

const { MoveToInboxRounded } = require("@material-ui/icons");
const mongoose = require("mongoose");

const annot_info = new mongoose.Schema(
  {
    
  }
)

//define a comment schema for the database
const PhotoSimpleAnnotSchema = new mongoose.Schema({
  caption_text_s: String, //This holds the thoughts on the photo that are not tags
  tag_text_s: String,
  photo_placeholder: String,
  difficulty: Number,
  quality: Number,
  uname: String,
  uid: String,
  annotation_info_array: String, //https://mongoosejs.com/docs/schematypes.html mixed is flexible
});

// compile model from schema
module.exports = mongoose.model("photo_simple_w_annotate", PhotoSimpleAnnotSchema);
