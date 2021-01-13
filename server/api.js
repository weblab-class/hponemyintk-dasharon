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

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

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
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

//Get photos from Mongoose and post photos to Mongoose, using web lab catbook api methods for stories as a model copied from api.js
router.get("/photos", (req, res) => {
  // if no more info will get all photos
  // will actually photo for certain user/friends and
  // certain  difficulty/etc. 
  Photo.find({}).then((photos) => res.send(photos));
});

//Posting one photo at a time, so there is a name difference with the get request
router.post("/photo", (req, res) => {
  const newPhoto = new Photo({ //**1/12 req body may need to be edited these are placeholders */
    creator_name: req.user.name, //believe comes from Google authentication from catbook api.js
    creator_id: req.user._id,
    photo_placeholder: req.body.photo_info, //This will be replaced with Google cloud linl
    tag_location_list: req.body.tag_location_list, //unsure why showing up in different color in VSCode
    tag_text_list: req.body.tag_text_list, //Also considered generic array w/o types in https://stackoverflow.com/questions/19695058/how-to-define-object-in-array-in-mongoose-schema-correctly-with-2d-geo-index
    caption: req.body.caption_text, //This holds the thoughts on the photo that are not tags
    difficulty_rating: req.body.difficulty_list,
    quality_rating: req.body.quality_rating_list
  });

  newPhoto.save().then((photo) => res.send(photo));
});

module.exports = router;
