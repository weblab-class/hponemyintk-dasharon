const mongoose = require("mongoose");

//this holds who rated and what that person rated
const DifficultyRatingUserSchema = new mongoose.Schema({
  ratingPhotoId: String,
  ratingValue: Number,
});

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  photoCount: Number,
  nativeLanguage: String,
  nativeLanguageLong: String,
  learningLanguage: String,
  learningLanguageLong: String,
  welcomeMessage: String,
  commentList: [String], //list of objects of photo id
  difficultyList: [DifficultyRatingUserSchema], //who rated what difficulty array lisst of objects of difficulty and id
  likeList: [String] //list of objects of photo id
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
