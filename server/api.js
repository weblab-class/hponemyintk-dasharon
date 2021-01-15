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

//From Nikhil's GCP tutorial https://github.com/weblab-workshops/gcp-example
const { uploadImagePromise, deleteImagePromise, downloadImagePromise } = require("./storageTalk");

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
//for debugging
router.post("/photo_simple", (req, res) => {
  //console.log(req.user.name);
  //console.log("req.user.name");
  //**1/12 req body may need to be edited these are placeholders */
  const newPhoto_simple = new PhotoSimple({ 
    uname: req.user.name,
    uid: req.user._id,
    caption_text_s : req.body.caption_text,
    tag_text_s : req.body.tag_text,
    photo_placeholder: req.body.photo_placeholder,
    difficulty: req.body.difficulty,
    quality: req.body.quality,
    taglist: req.body.taglist,
  });

  newPhoto_simple.save();

  //then((photo_simple) => res.send(photo_simple));
});

//1/13 annotating
router.post("/photo_simple_w_annotate", (req, res) => {
  //console.log(req.user.name);
  //console.log("req.user.name");
  //**1/12 req body may need to be edited these are placeholders */
  // const annot_test_1958 = new PhotoSimpleAnnotModels.annot_info_mongoose(
  //   {
  //     data:
  //       {
  //         id: 1, //this.state.annotations[annot_to_add].data.id,
  //         text: "abc", //this.state.annotations[annot_to_add].data.text,
  //       },
  //     geometry:
  //       {
  //         height: 22, //this.state.annotations[annot_to_add].geometry.height,
  //         shape_kind: "abc", //this.state.annotations[annot_to_add].geometry.type,
  //         width: 33, //this.state.annotations[annot_to_add].geometry.width,
  //         x: 2, //this.state.annotations[annot_to_add].geometry.x,
  //         y: 5, //this.state.annotations[annot_to_add].geometry.y,
  //       }
  //   }
  //   );
  //From Nikhil GCP example https://github.com/weblab-workshops/gcp-example
  if (typeof (req.body.photo_placeholder) !== 'string') {
    throw new Error("Can only handle images encoded as strings. Got type: "
      + typeof (req.body.photo_placeholder));
  }

  console.log("tried upload")
  //try uploading
  uploadImagePromise(req.body.photo_placeholder).then( (image_upload_info) => {//if success then set up schema
  //If not error continue (https://stackoverflow.com/questions/30469261/checking-for-typeof-error-in-js)
  
    //Set up schema
    const newPhoto_simplea = new PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose({ 
      caption_text_s : req.body.caption_text,
      tag_text_s : req.body.tag_text,
      photo_placeholder: image_upload_info,
      difficulty: req.body.difficulty,
      quality: req.body.quality,
      uname: req.user.name,
      uid: req.user._id,
      submit_stamp: req.body.timestamp,
      annotation_info_array: req.body.annotate_test //req.body.annotate_test, OH Johan 20:08
    });

    //from OH 1/13/21 many thanks to Johan for debugging help!
    const body_check = {
      caption_text_s : req.body.caption_text,
      tag_text_s : req.body.tag_text,
      photo_placeholder: image_upload_info,
      difficulty: req.body.difficulty,
      quality: req.body.quality,
      uname: req.user.name,
      uid: req.user._id,
      submit_stamp: req.body.timestamp,
      annotation_info_array: req.body.annotate_test //req.body.annotate_test,
    };
    console.log(body_check);
    newPhoto_simplea.save();
  }
  ).catch(err => {
    console.log("ERR: upload image: " + err);
    res.status(500).send({
      message: "error uploading",
    });
  })
},

  //then((photo_simple) => res.send(photo_simple));
);

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
