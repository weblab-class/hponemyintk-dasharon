/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Photo = require("./models/photo"); //add 1/12 to enable photo schema to be used
const PhotoSimple = require("./models/photo_simple"); //add 1/12 to enable photo schema to be used
const PhotoSimpleAnnotModels = require("./models/photo_simple_w_annotate"); //add 1/12 to enable photo schema to be used

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

// [credit: From Nikhil's GCP tutorial https://github.com/weblab-workshops/gcp-example]
const { uploadImagePromise, deleteImagePromise, downloadImagePromise } = require("./storageTalk");
// const quickStart = require("./Translation");

//initialize socket
const socketManager = require("./server-socket");

// translation imports https://cloud.google.com/translate/docs/basic/quickstart
const { Translate } = require("@google-cloud/translate").v2;

// From Nikhil's https://github.com/weblab-workshops/gcp-example, comments copied (another ref: https://cloud.google.com/docs/authentication/production#passing_code, Google Translate: https://cloud.google.com/translate/docs/basic/quickstart)
//We followed Nikhil's StorageTalk.js extensively in writing this code, as well as Google Translate documentation
// NOTE: this file is incomplete. Eventually I'll add a function to modify an existing
// file, but this is a pretty uncommon application in my experience, so I'll do it later.


// The advantage of this cache is that we avoid loading images we've seen recently,
// since GCP will charge you money if you request too much data. See GCP pricing.
// This sets time to live to 2hrs, and to check for expired cache entries every hour.
// If you don't understand this, just take out all the lines that have "cache" in them.

// TODO: replace this projectId with your own GCP project id!
const translationInfo = { projectId: "angelic-cat-301602" };
if (process.env.GCP_PRIVATE_KEY && process.env.GCP_CLIENT_EMAIL) {
    translationInfo.credentials = { private_key: process.env.GCP_PRIVATE_KEY, client_email: process.env.GCP_CLIENT_EMAIL };
}

// Creates a client
const translate = new Translate(translationInfo);

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

//Get photos from Mongoose and post photos to Mongoose, using web lab catbook api methods for stories as a model copied from api.js
router.get("/photos", (req, res) => {
  // if no more info will get all photos
  // will actually photo for certain user/friends and
  // certain  difficulty/etc.
  Photo.find({}).then((photos) => res.send(photos));
});

//1/13 annotating
router.post("/photo_simple_w_annotate", auth.ensureLoggedIn, (req, res) => {
  // [credit: From Nikhil GCP example https://github.com/weblab-workshops/gcp-example]
  /* Check if image is passed as a valid string or not */
  if (typeof req.body.photo_placeholder !== "string") {
    throw new Error(
      "Can only handle images encoded as strings. Got type: " + typeof req.body.photo_placeholder
    );
  }
  /* If valid, upload image to GCP, store the imageId in the schema, and submit schemaInfo to Mongodb */
  uploadImagePromise(req.body.photo_placeholder)
    .then((image_upload_info) => {
      //if success then set up schema //If not error continue [ref: https://stackoverflow.com/questions/30469261/checking-for-typeof-error-in-js]
      // [credit: from OH 1/13/21 many thanks to Johan for debugging help!]
      const newPhoto_simplea = new PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose({
        caption_text_s: req.body.caption_text,
        tag_text_s: req.body.tag_text,
        photo_placeholder: image_upload_info,
        difficulty: req.body.difficulty,
        quality: req.body.quality,
        uname: req.user.name,
        uid: req.user._id,
        submit_stamp: req.body.timestamp,
        annotation_info_array: req.body.annotate_test, //req.body.annotate_test, OH Johan 20:08
      }); //save the photo and then set the everUpdated field for the user to be true
      //https://mongoosejs.com/docs/tutorials/findoneandupdate.html, code in @836 on Piazza https://piazza.com/class/kic6jaqsarc70r?cid=836
      //update the user schema to reflect that this user uploaded a photo- only do this after uploading the photo and finding userId
      newPhoto_simplea.save();
      //User.findById(req.user._id).then(userUpdating => console.log("UPDATING", userUpdating), userUpdating.everUploaded = true, userUpdating.save()); //User.findById(req.user._id)).then(userUpdating => {console.log("UPDATING", userUpdating)})
    })
    .catch((err) => {
      console.log("ERR: upload image: " + err);
      res.status(500).send({
        message: "error uploading",
      });
    })
    User.findById(req.user._id).then(userUpdating => {console.log("UPDATING AFTER 2", userUpdating), userUpdating.everUploaded = true, userUpdating.save(),console.log("USER UPDATED AFTER 2", userUpdating)});
});

//Deletes a photo from the database
//ref https://kb.objectrocket.com/mongo-db/how-to-delete-documents-with-mongoose-235
//https://www.geeksforgeeks.org/mongoose-findbyidanddelete-function/
//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete
//also tried convert to string https://stackoverflow.com/questions/11083254/casting-to-string-in-javascript
router.post("/deletePhoto", auth.ensureLoggedIn, (req, res) => {
  console.log("api should delete",req.body.deletionId,"todelete");
  //console.log("api should delete", Str(req.body.deletionId));
  PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose.findByIdAndDelete(req.body.deletionId, function (err, docs) { 
    if (err){ 
        console.log(err) 
    } 
    else{ 
        console.log("Deleted : ", docs); 
    } 
});
});

// Get the first photo of a user [ref: Following W6 slide 74]
router.get("/photosimpletest", auth.ensureLoggedIn, async (req, res) => {
  console.log("api.js photosimpletest req is:::", req.query);
  try {
    const UserSchema = await PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose.find({
      uid: req.query.userId,
    }); //1 get one photo array from mongoose
    //iterate through all user's photos, note this could incorporate a map/promise all
    for (let u_info = 0; u_info < UserSchema.length; u_info++) {
      const imagePromise = await downloadImagePromise(UserSchema[u_info].photo_placeholder); //2 convert to google cloud object
      UserSchema[u_info].photo_placeholder = imagePromise;
    } //3 replace photo placeholder with the base64 DataURL from GCP
    // console.log("api.js:::","Here printing google image",imagePromise);
    res.send(UserSchema);
    //here res is shorthand for asking the server (port3000) to send back this stiched up schema back to frontend (port5000)
  } catch (e) {
    console.log("ERR getImages this shouldn't happen");
    res.status(400).json({ message: e.message });
  }
});

// Was working, to Get the first photo of a user [ref: Following W6 slide 74], 1/16 00:28 edit to get multiple images
// Dina added back 1/17 to get working when only 1 image is wanted
router.get("/photosimpletestOne", auth.ensureLoggedIn, async (req, res) => {
  console.log("api.js photosimpletestOne req query:::", req.query);
  try {
    const UserSchema = await PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose.findOne({
      uid: req.query.userId,
    }); //1 get one photo array from mongoose
    const imagePromise = await downloadImagePromise(UserSchema.photo_placeholder); //2 convert to google cloud object
    UserSchema.photo_placeholder = imagePromise; //3 replace photo placeholder with the base64 DataURL from GCP
    // console.log("api.js:::","Here printing google image",imagePromise);
    res.send(UserSchema); //here res is shorthand for asking the server (port3000) to send back this stiched up schema back to frontend (port5000)
  } catch (e) {
    console.log("ERR getImages this shouldn't happen");
  }
});

// Was working, to Get the first photo of a user [ref: Following W6 slide 74], 1/16 00:28 edit to get multiple images
// Dina added back 1/17 to get working when only 1 image is wanted
//This is 1/18 to get only 1 photo for the homepage
router.get("/photosimpletestOnebyid", auth.ensureLoggedIn, async (req, res) => {
  console.log("api.js photosimpletestOne req query:::", req.query);
  try {
    const UserSchema = await PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose.findOne({
      _id: req.query.photoId,
    }); //1 get one photo array from mongoose
    const imagePromise = await downloadImagePromise(UserSchema.photo_placeholder); //2 convert to google cloud object
    UserSchema.photo_placeholder = imagePromise; //3 replace photo placeholder with the base64 DataURL from GCP
    // console.log("api.js:::","Here printing google image",imagePromise);
    res.send(UserSchema); //here res is shorthand for asking the server (port3000) to send back this stiched up schema back to frontend (port5000)
  } catch (e) {
    console.log("ERR getImages this shouldn't happen");
  }
});

//find all of the users
router.get("/all_user_find", auth.ensureLoggedIn, (req, res) => {
  //Run a Mongoose query to get all users, and then send it back in the response
  //Learned from catbook {} means find everyone
  User.find({}).then((infoOnUsers) => res.send(infoOnUsers));
});

router.get("/singleUserFind", (req, res) => {
  // console.log("REQ", req);
  //Run a Mongoose query to get all users, and then send it back in the response
  //https://mongoosejs.com/docs/api.html#model_Model.findById
  //Learned from catbook {} means find everyone
  User.findById(req.query.checkUserId).then((infoOnUser) => {
    // console.log("USER INFO", infoOnUser);
    res.send(infoOnUser);
  });
  // User.findOne({_id : req.query.checkUserId}).then((infoOnUser) =>
  // console.log("USER INFO", infoOnUser),
  // res.send(infoOnUser))
});

//run Google translate from Translate.js, this is called by ImgUpload_1716_try_no_prototype.js
//ref https://cloud.google.com/translate/docs/basic/quickstart https://googleapis.dev/nodejs/translate/latest/
router.post("/translation", async (req, res) => {
      // The text to translate
    const text = req.body.translationInput;
  
    // // The target language
    const target = 'es';
  
    // // Translates some text into Russian
    const translation = await translate.translate(text, target);
    console.log(`Text: ${text}`);
    console.log(`Translation: ${translation}`);
    res.send({output : translation});
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;

/***************************** *******************************************/
/*** Old comments from Dian for router.get("/photo_simple_w_annotate" ***/
/***************************** *******************************************/
// console.log(imagePromise);
//   /, then convert from Google Cloud object, and then return resulting schema and photo info
// .then(photo_output =>
//{
// console.log("here", {photo_output}); //https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/ 2 deep copy so this can go in next method hopefully //2 go from photo placeholder as stored in Mongoose to photo data in Google Cloud
// console.log(photo_output.photo_placeholder);
//}
// ).then((image_promise_output) => {
//photo_output.photo_placeholder = image_promise_output; //3 replace the placeholder with the actual output
// console.log(photo_output.photo_placeholder);
// res.send({message: "Successfully updated user."}) //send back https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
