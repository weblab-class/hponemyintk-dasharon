// Holds photo information
// This is from web lab catbook server dir schema
//1/12/21 22:30 for debugging

const { MoveToInboxRounded } = require("@material-ui/icons");
const mongoose = require("mongoose");

//uses subdocuments https://mongoosejs.com/docs/subdocs.html

const annot_info = new mongoose.Schema(
  {
  //  data :
  //   {
  //     id: Number,
  //     text: String
  //   },
   geometry :
   {
    //  height: Number,
    //  type: String,
    //  width: Number,
     x: Number,
     y: Number,
   }
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
  annotation_info_array: [annot_info], //[annot_info], //[annot_info], //https://mongoosejs.com/docs/schematypes.html mixed is flexible
});

// compile model from schema
module.exports = mongoose.model("photo_simple_w_annotate", PhotoSimpleAnnotSchema);
