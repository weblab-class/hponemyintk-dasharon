// Holds photo information
// This is from web lab catbook server dir schema

const mongoose = require("mongoose");

//define a comment schema for the database
const PhotoSchema = new mongoose.Schema({
  creator_name: String,
  creator_id: String,
  photo_placeholder: String, //This will be replaced with Google cloud linl
  tag_location_list: [Number], //unsure why showing up in different color in VSCode
  tag_text_list: [String], //Also considered generic array w/o types in https://stackoverflow.com/questions/19695058/how-to-define-object-in-array-in-mongoose-schema-correctly-with-2d-geo-index
  caption: String, //This holds the thoughts on the photo that are not tags
  difficulty_rating: [Number],
  quality_rating: [Number]
});

// compile model from schema
module.exports = mongoose.model("photo", PhotoSchema);
