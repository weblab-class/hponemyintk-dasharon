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
        text: String, //this is the word in the language the user learns, can get flipped on processing
        textforBox: String, //this is the word in the native language, can get flipped on processing
        nativeLanguageTag: String, //also store explicitly for flipping- this will always be the word in the native language
        learningLanguageTag: String //also store explicitly for flipping- this will always be the word in the language learned
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

//this holds who rated and what that person rated
const DifficultyRatingSchema = new mongoose.Schema(
  {
    ratingUserId: String,
    ratingValue: Number
  }
);

//this holds who liked
const LikingRatingSchema = new mongoose.Schema(
  {
    likingUserId: String,
    likingUserName: String
  }
);

//define a comment schema for the database
const PhotoSimpleAnnotSchema = new mongoose.Schema({
  captionTextOriginal: String, //This holds the thoughts on the photo that are not tags- in native language
  captionTextTranslated: String, //This holds the thoughts on the photo that are not tags- in language learning
  photo_placeholder: String, //This is google cloud placeholder
  goodforQuiz: Boolean, //Boolean whether this should be used on the quiz- has tags, at least one of which has fewer than 3 words
  difficulty: Number, //currrent average difficulty rating
  difficultyRatings: [DifficultyRatingSchema], //who rated what difficulty array
  usersLikingArray: [LikingRatingSchema], //array of user IDs who liked this photo
  uname: String, //username of individual posting
  uid: String, //user id of individual posting
  submit_stamp: String, //submission timestamp readable
  submit_stamp_raw: String, //submission timestamp sortable
  inputLanguages: [String], //list of detected input languages
  translatedLanguage: String, //translated language, set to be language the user is learning
  annotation_info_array: [AnnotInfoSchema], //array of annotation data [annot_info], //[annot_info], //https://mongoosejs.com/docs/schematypes.html mixed is flexible
});

// compile model from schema
module.exports = {
  photo_simple_w_annotate_mongoose : mongoose.model("photo_simple_w_annotate", PhotoSimpleAnnotSchema),
  annot_info_mongoose : mongoose.model("annot_info", AnnotInfoSchema),
  difficulty_rating_mongoose : mongoose.model("difficulty_rating", DifficultyRatingSchema),
  liking_rating_mongoose : mongoose.model("liking_rating", LikingRatingSchema)
};