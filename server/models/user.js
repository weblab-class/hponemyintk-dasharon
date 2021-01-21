const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  photoCount: Number,
  nativeLanguage: String,
  nativeLanguageLong: String,
  learningLanguage: String,
  learningLanguageLong: String
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
