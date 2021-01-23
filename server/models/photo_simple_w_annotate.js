// Holds photo information
// This is from web lab catbook server dir schema
//1/12/21 22:30 for debugging

const { MoveToInboxRounded } = require("@material-ui/icons");
const mongoose = require("mongoose");

//uses subdocuments https://mongoosejs.com/docs/subdocs.html

const AnnotInfoSchema = new mongoose.Schema(
  {
   data:
      {
        id: Number,
        text: String, //this is the word in the language the user learns
        textforBox: String, //this is the word in the native language
      },
    geometry:
    {
      height: Number,
      shape_kind: String,
      width: Number,
      x: Number,
      y: Number,
    }
  }
);

//define a comment schema for the database
const PhotoSimpleAnnotSchema = new mongoose.Schema({
  caption_text_s: String, //This holds the thoughts on the photo that are not tags
  tag_text_s: String,
  photo_placeholder: String,
  difficulty: Number,
  quality: Number,
  uname: String,
  uid: String,
  submit_stamp: String,
  submit_stamp_raw: String,
  inputLanguages: [String],
  translatedLanguage: String,
  annotation_info_array: [AnnotInfoSchema], //[annot_info], //[annot_info], //https://mongoosejs.com/docs/schematypes.html mixed is flexible
});

// compile model from schema
module.exports = {
  photo_simple_w_annotate_mongoose : mongoose.model("photo_simple_w_annotate", PhotoSimpleAnnotSchema),
  annot_info_mongoose : mongoose.model("annot_info", AnnotInfoSchema),
};