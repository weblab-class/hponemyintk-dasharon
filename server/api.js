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
const Comment = require("./models/comment");

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
  translationInfo.credentials = {
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: process.env.GCP_CLIENT_EMAIL,
  };
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

//1/13 annotating
router.post("/photo_simple_w_annotate", auth.ensureLoggedIn, async (req, res) => {
  // [credit: From Nikhil GCP example https://github.com/weblab-workshops/gcp-example]
  /* Check if image is passed as a valid string or not */
  try {
    if (typeof req.body.photo_placeholder !== "string") {
      throw new Error(
        "Can only handle images encoded as strings. Got type: " + typeof req.body.photo_placeholder
      );
    }
    /* If valid, upload image to GCP, store the imageId in the schema, and submit schemaInfo to Mongodb */
    image_upload_info = await uploadImagePromise(req.body.photo_placeholder);
    // .then((image_upload_info) => {
    //if success then set up schema //If not error continue [ref: https://stackoverflow.com/questions/30469261/checking-for-typeof-error-in-js]
    // [credit: from OH 1/13/21 many thanks to Johan for debugging help!]
    const newPhoto_simplea = new PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose({
      captionTextOriginal: req.body.caption_text_original,
      captionTextTranslated: req.body.caption_text_translated,
      tag_text_s: req.body.tag_text,
      photo_placeholder: image_upload_info,
      difficulty: req.body.difficulty,
      difficultyRatings: req.body.difficultyRatingArray,
      usersLikingArray: req.body.usersLikingArray,
      likeCount: req.body.likeCount,
      goodforQuiz: req.body.goodforQuiz,
      uname: req.user.name,
      uid: req.user._id,
      submit_stamp_raw: req.body.timestampRaw,
      submit_stamp: req.body.timestamp,
      inputLanguages: req.body.inputLanguageInfo,
      translatedLanguage: req.body.translatedLanguage,
      annotation_info_array: req.body.annotate_test, //req.body.annotate_test, OH Johan 20:08
    }); //save the photo and then set the everUpdated field for the user to be true
    //https://mongoosejs.com/docs/tutorials/findoneandupdate.html, code in @836 on Piazza https://piazza.com/class/kic6jaqsarc70r?cid=836
    //update the user schema to reflect that this user uploaded a photo- only do this after uploading the photo and finding userId
    photoSaving = await newPhoto_simplea.save();
    //User.findById(req.user._id).then(userUpdating => console.log("UPDATING", userUpdating), userUpdating.everUploaded = true, userUpdating.save()); //User.findById(req.user._id)).then(userUpdating => {console.log("UPDATING", userUpdating)})
    let userUpdating = await User.findById(req.user._id);
    console.log("UPDATING INIT", userUpdating),
      (userUpdating.photoCount = userUpdating.photoCount + 1); //increment photo count
    if (req.body.likeCount > 0) {
      userUpdating.likeList = userUpdating.likeList.concat(photoSaving._id);
    } //if liked add to liked list
    if (req.body.difficulty > 0) {
      userUpdating.difficultyList = userUpdating.difficultyList.concat({
        //if rated difficulty add to difficulty list
        ratingPhotoId: photoSaving._id, //add id of photo saved
        ratingValue: req.body.difficulty, //set to rated difficulty
      });
    } //if rated difficulty add to personal ratings array
    userUpdating.save();
    console.log("USER UPDATED AFTER 2", userUpdating);
    res.send(userUpdating);
  } catch (err) {
    console.log("ERR: upload image: " + err);
    res.status(500).send({
      message: "error uploading",
    });
  }
});

//   });
// });

//Deletes a photo from the database
//ref https://kb.objectrocket.com/mongo-db/how-to-delete-documents-with-mongoose-235
//https://www.geeksforgeeks.org/mongoose-findbyidanddelete-function/
//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete
//also tried convert to string https://stackoverflow.com/questions/11083254/casting-to-string-in-javascript
router.post("/deletePhoto", auth.ensureLoggedIn, (req, res) => {
  console.log("api should delete", req.body.deletionId, "todelete");
  //console.log("api should delete", Str(req.body.deletionId));
  PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose.findByIdAndDelete(
    req.body.deletionId,
    function(err, docs) {
      if (err) {
        console.log(err);
        res.send({});
      } else {
        console.log("Deleted : ", docs);
        //Decrement the photo count.
        //ref https://mongoosejs.com/docs/tutorials/findoneandupdate.html, code in @836 on Piazza https://piazza.com/class/kic6jaqsarc70r?cid=836
        try {
          User.findById(req.user._id).then((userUpdating) => {
            console.log("UPDATING AFTER 2", userUpdating),
              (userUpdating.photoCount = userUpdating.photoCount - 1),
              userUpdating.save(),
              console.log("USER UPDATED AFTER 2", userUpdating);
            res.send({});
          });
        } catch (e) {
          console.log("user update error");
          res.status(400).json({ message: e.message });
        }
      }
    }
  );
});

// Get the first photo of a user [ref: Following W6 slide 74]
router.get("/photosimpletest", auth.ensureLoggedIn, async (req, res) => {
  console.log("api.js photosimpletest req is:::", req.query);
  try {
    const UserSchema = await PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose
      .find({
        uid: req.query.userId,
      })
      .sort({ submit_stamp_raw: -1 }); //1 get one photo array from mongoose, sort so latest are first ref https://medium.com/@jeanjacquesbagui/in-mongoose-sort-by-date-node-js-4dfcba254110 https://stackoverflow.com/questions/4299991/how-to-sort-in-mongoose https://mongoosejs.com/docs/api/query.html
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

// Get all photos
router.get("/photosforquiz", auth.ensureLoggedIn, async (req, res) => {
  // console.log("api.js photosimpletest req is:::", req.query);
  try {
    const UserSchema = await PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose.aggregate([
      { $sample: { size: 10 } },
    ]); //1 get photo array from mongoose
    //iterate through all user's photos, note this could incorporate a map/promise all, limit to 5 photos, ref https://www.tutorialspoint.com/find-a-specified-amount-of-records-in-mongodb
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
    const UserSchema = await PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose
      .findOne({
        uid: req.query.userId,
      })
      .sort({ submit_stamp_raw: -1 }); //1 get one photo array from mongoose and get newest, ref https://stackoverflow.com/questions/12467102/how-to-get-the-latest-and-oldest-record-in-mongoose-js-or-just-the-timespan-bet
    const imagePromise = await downloadImagePromise(UserSchema.photo_placeholder); //2 convert to google cloud object
    UserSchema.photo_placeholder = imagePromise; //3 replace photo placeholder with the base64 DataURL from GCP
    // console.log("api.js:::","Here printing google image",imagePromise);
    res.send(UserSchema); //here res is shorthand for asking the server (port3000) to send back this stiched up schema back to frontend (port5000)
  } catch (e) {
    console.log("ERR getImages this shouldn't happen");
    res.status(400).json({ message: e.message });
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
    res.status(400).json({ message: e.message });
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
  console.log("IN TRANSLATION", req.body);
  // The text to translate
  const text = req.body.translationInput;

  // // The target language
  const target = req.body.userTranslationLanguage;

  // // Translates some text into Russian
  const translation = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
  res.send({ output: translation });
});

//Chhanges language a user wants to learn and the welcome message
router.post("/changeLanguage", (req, res) => {
  // console.log("REQ", req);
  //Run a Mongoose query to get the right user and update the language learning for the user
  //https://mongoosejs.com/docs/api.html#model_Model.findById
  //Learned from catbook {} means find everyone
  User.findById(req.user._id).then((userUpdating) => {
    console.log("UPDATING AFTER 2", userUpdating),
      //run updates
      (userUpdating.learningLanguage = req.body.newLanguage),
      (userUpdating.learningLanguageLong = req.body.newLanguageLong),
      (userUpdating.welcomeMessage = req.body.welcomeMessageText),
      //save
      userUpdating.save();
    console.log("USER UPDATED AFTER 2", userUpdating);
  });

  // User.findOne({_id : req.query.checkUserId}).then((infoOnUser) =>
  // console.log("USER INFO", infoOnUser),
  // res.send(infoOnUser))
});

//comment post and get requests are from catbook, many thanks to Kye for indicating we can use this!
router.post("/comment", auth.ensureLoggedIn, async (req, res) => {
  try {
    console.log("API LOG", req.body); //log

    const newComment = new Comment({
      creator_id: req.user._id,
      creator_name: req.user.name,
      parent: req.body.parent,
      contentTranslated: req.body.contentTranslated,
      contentOriginal: req.body.contentOriginal,
      timestampRaw: req.body.timestampRaw,
      timestampPrintable: req.body.timeStampPrintable,
    });

    const savedComment = await newComment.save(); // get comment saved
    let userUpdating = await User.findById(req.user._id); //get user requesting
    console.log("UPDATING", userUpdating);
    userUpdating.commentList = userUpdating.commentList.concat(req.body.parent); //add the photo ID of the post commented on for user requesting
    userUpdating.save();
    console.log(userUpdating); //save for new user
    res.send(savedComment);
  } catch (e) {
    //then is from Nikhil gcp storage code
    console.log("error in comment");
    res.status(400).json({ message: e.message });
  }
});

//update difficulty rating
router.post("/difficultyRating", auth.ensureLoggedIn, async (req, res) => {
  try {
    console.log("difficulty api", req.body);

    //1 get the photo being rated
    let photoSchema = await PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose.findOne({
      _id: req.body.photoId,
    });

    console.log("difficulty in api", photoSchema.difficulty);
    console.log("entire schema in api", photoSchema);
    //let oldDifficulty = PhotoSchema.difficulty,

    //2 who already rated it? get the array ref https://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array
    let allAlreadyRated = photoSchema.difficultyRatings.map((rating) => rating.ratingUserId);
    console.log("who already rated?", allAlreadyRated);

    //3 add or edit user rating ref https://www.w3schools.com/jsref/jsref_includes_array.asp
    if (allAlreadyRated.includes(req.user._id)) {
      //3a if already in array get the relevant entry and edit ref https://stackoverflow.com/questions/12462318/find-a-value-in-an-array-of-objects-in-javascript https://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array
      console.log(
        "API update entry",
        photoSchema.difficultyRatings.find((ratingInfo) => ratingInfo.ratingUserId === req.user._id)
      );

      //revise ratings array- go through and change the element
      for (let rr = 0; rr < photoSchema.difficultyRatings.length; rr++) {
        if (photoSchema.difficultyRatings[rr].ratingUserId === req.user._id) {
          photoSchema.difficultyRatings[rr] = {
            ratingUserId: req.user._id,
            ratingValue: req.body.difficultyRating,
          };
        }
      }
      console.log("updated array", photoSchema.difficultyRatings);
      // let revisedRatings = photoSchema.difficultyRatings.find((ratingInfo, indexVal) =>
      // {if (ratingInfo.ratingUserId === req.user._id)
      //   photoSchema.difficultyRatings[indexVal].ratingValue = req.body.difficultyRating;
      // }

      // //update ratings array and the difficulty

      // )

      let difficultyEntriesAverage =
        photoSchema.difficultyRatings.reduce(
          (a, difficultyEntry) => a + difficultyEntry.ratingValue,
          0
        ) / photoSchema.difficultyRatings.length;
      photoSchema.difficulty = difficultyEntriesAverage;
      console.log("average difficulty", difficultyEntriesAverage);
      photoSchematoReturn = await photoSchema.save();
      console.log("after saving", photoSchema);

      // //also update user difficulty rating list
      // let userUpdating = await User.findById(req.user._id);
      // console.log("adding difficulty");
      // console.log("UPDATING INIT", userUpdating);
      // userUpdating.difficultyList = userUpdating.difficultyList.concat({
      //   ratingPhotoId: photoSchematoReturn._id,
      //   ratingValue: req.body.difficultyRating,
      // }); //add photo liking to liked list
      // userUpdating.save();

      //also update user difficulty rating list
      let userUpdating = await User.findById(req.user._id);
      console.log("adding difficulty");
      console.log("UPDATING INIT", userUpdating);
      let updatedUserDifficulty = await userUpdating.difficultyList.filter(
        (pid) => pid.ratingPhotoId !== req.body.photoId
      ); //remove this photo from the lst and replace with new rating
      console.log("AFTER FILTER", updatedUserDifficulty);
      console.log("NEW ID", req.body.photoId);
      let updatedUserDifficultyFinal = await updatedUserDifficulty.concat({
        ratingPhotoId: req.body.photoId,
        ratingValue: req.body.difficultyRating,
      });
      (userUpdating.difficultyList = updatedUserDifficultyFinal),
        // for (let uu = 0; uu < userUpdating.difficultyList.length; uu++) {
        //   if (userUpdating.difficultyList[uu].ratingPhotoId === photoSchematoReturn._id) { //find the photo being updated
        //     userUpdating.difficultyList[uu] = {
        //       ratingPhotoId: photoSchematoReturn._id,
        //       ratingValue: req.body.difficultyRating,
        //     };
        //   }
        // }

        console.log("UPDATED", userUpdating);

      userUpdating.save();
    }

    //3b if not in array already addd new entry
    else {
      //console.log("API need to add to array")

      //create new entry
      let newRatingEntry = {
        ratingUserId: req.user._id,
        ratingValue: req.body.difficultyRating,
      };
      console.log("API new rating entry", newRatingEntry);

      //add new entry
      photoSchema.difficultyRatings = photoSchema.difficultyRatings.concat(newRatingEntry);

      //average difficulty reference https://stackoverflow.com/questions/52513123/how-to-get-the-average-from-array-of-objects https://www.tutorialspoint.com/how-to-calculate-the-average-in-javascript-of-the-given-properties-in-the-array-of-objects https://stackoverflow.com/questions/53106132/find-average-of-an-array-of-objects
      let difficultyEntriesAverage =
        photoSchema.difficultyRatings.reduce(
          (a, difficultyEntry) => a + difficultyEntry.ratingValue,
          0
        ) / photoSchema.difficultyRatings.length;
      photoSchema.difficulty = difficultyEntriesAverage;
      console.log("average difficulty", difficultyEntriesAverage);
      photoSchematoReturn = await photoSchema.save();
      console.log("after saving", photoSchema);

      //also update user difficulty rating list
      let userUpdating = await User.findById(req.user._id);
      console.log("adding difficulty");
      console.log("UPDATING INIT", userUpdating);
      userUpdating.difficultyList = userUpdating.difficultyList.concat({
        ratingPhotoId: photoSchematoReturn._id,
        ratingValue: req.body.difficultyRating,
      }); //add photo liking to liked list
      userUpdating.save();
    }

    // photoSchema.save();
    res.send(photoSchematoReturn);
  } catch (e) {
    //then is from Nikhil gcp storage code
    console.log("error in difficultyRating");
    res.status(400).json({ message: e.message });
  }
});

//update difficulty rating
router.post("/likingRating", auth.ensureLoggedIn, async (req, res) => {
  try {
    //1 get the photo being rated
    let photoSchema = await PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose.findOne({
      _id: req.body.photoId,
    });
    console.log("pull photo", photoSchema._id);
    if (req.body.addLike) {
      //if wanting to add a like- increment like count and then add new liking user name and id to schema
      photoSchema.likeCount = photoSchema.likeCount + 1;
      newLikeInfo = { likingUserId: req.user._id, likingUserName: req.user.name };
      photoSchema.usersLikingArray = photoSchema.usersLikingArray.concat(newLikeInfo);
      // console.log("adding like", newLikeInfo);
      // console.log("new schema", photoSchema);
      photoSchemaUpdated = await photoSchema.save();
      res.send(photoSchemaUpdated);

      //also update user
      let userUpdating = await User.findById(req.user._id);
      console.log("adding like");
      console.log("UPDATING INIT", userUpdating);
      userUpdating.likeList = userUpdating.likeList.concat(req.body.photoId); //add photo liking to liked list
      userUpdating.save();
    } //if wanting to unlike- decrement like count and remove new liking user name and id from schema
    else {
      photoSchema.likeCount = photoSchema.likeCount - 1;

      //iterate through array and find element to delete, will only go here if the user is in the already liking array
      //splice ref https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
      //filter ref https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
      //only keep elements if they are not the user id we are deleting
      photoSchema.usersLikingArray = photoSchema.usersLikingArray.filter(
        (u) => u.likingUserId !== req.user._id
      );
      // let deletionIndex = -1;
      // for (let uu =0; uu < photoSchema.usersLikingArray.length; uu++)
      // {
      //   if (photoSchema.usersLikingArray[uu].likingUserId === req.user._id)
      //   {
      //     console.log("FOUND")
      //     deletionIndex = uu //when found the appropriate userId, set the deletion index
      //   }
      // }

      // //run deletion
      // photoSchema.usersLikingArray = photoSchema.usersLikingArray.splice(deletionIndex, 1);
      // console.log("removing like", req.user._id);
      // console.log("new schema", photoSchema);
      photoSchemaUpdated = await photoSchema.save();
      res.send(photoSchemaUpdated);

      //also update user
      let userUpdating = await User.findById(req.user._id);
      console.log("UPDATING INIT", userUpdating.likeList);
      console.log("WANT TO DELETE", req.body.photoId);
      let updatedLikes = await userUpdating.likeList.filter((pid) => pid !== req.body.photoId); //remove this photo from the liked list
      console.log("UPDATING AFTER", updatedLikes);
      userUpdating.likeList = updatedLikes;
      userUpdating.save();
    }
  } catch (e) {
    //then is from Nikhil gcp storage code
    console.log("error in likingRating");
    res.status(400).json({ message: e.message });
  }
});

router.get("/comment", (req, res) => {
  //1 get comment array from mongoose, sort so earliest are first ref https://medium.com/@jeanjacquesbagui/in-mongoose-sort-by-date-node-js-4dfcba254110 https://stackoverflow.com/questions/4299991/how-to-sort-in-mongoose https://mongoosejs.com/docs/api/query.html
  Comment.find({ parent: req.query.parent })
    .sort({ submit_stamp_raw: 1 })
    .then((comments) => {
      res.send(comments);
    });
});

/***********************************************/
/*** get requests for filtering images/posts ***/
/***********************************************/
// for getting photos ranked by most/least difficulty/like rating
// will take in req.query.sortString (to filter by key name), req.query.sortFlag (to sort by descending (-1) or ascending (+1) order), req.query.lim (to limit # pics return), req.query.keyname, req.query.keyvalue. req.query.startInd is used for skipping all the initial items until we get to the Ind location in the list.
router.get("/photoFilter", auth.ensureLoggedIn, async (req, res) => {
  try {
    //1 get specified number of most difficult images from the data base

    let UserSchema = [];
    if (req.query.keyvalue.length !== 0) {
      UserSchema = await PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose
        .find({ [req.query.keyname]: req.query.keyvalue })
        .sort({ [req.query.sortString]: Number(req.query.sortFlag) })
        .skip(Number(req.query.startInd))
        .limit(Number(req.query.lim));
    } else {
      UserSchema = await PhotoSimpleAnnotModels.photo_simple_w_annotate_mongoose
        .find({})
        .sort({ [req.query.sortString]: Number(req.query.sortFlag) }) //ref: https://stackoverflow.com/questions/33160536/mongoose-variable-sort
        .limit(Number(req.query.lim));
    }

    for (let u_info = 0; u_info < UserSchema.length; u_info++) {
      const imagePromise = await downloadImagePromise(UserSchema[u_info].photo_placeholder); //2 convert to google cloud object
      UserSchema[u_info].photo_placeholder = imagePromise;
    } //3 replace photo placeholder with the base64 DataURL from GCP
    res.send(UserSchema);
    //here res is shorthand for asking the server (port3000) to send back this stiched up schema back to frontend (port5000)
  } catch (e) {
    console.log("ERR getImages this shouldn't happen");
    res.status(400).json({ message: e.message });
  }
});
/***********************************************/

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;

/***************************** *******************************************/
/*** Old comments from Dsian for router.get("/photo_simple_w_annotate" ***/
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

// //1/21/21 This was working, going to edit to make for other languages though
// //run Google translate from Translate.js, this is called by ImgUpload_1716_try_no_prototype.js
// //ref https://cloud.google.com/translate/docs/basic/quickstart https://googleapis.dev/nodejs/translate/latest/
// router.post("/translationOld", async (req, res) => {
//   // The text to translate
//   const text = req.body.translationInput;

//   // // The target language
//   const target = "es";

//   // // Translates some text into Russian
//   const translation = await translate.translate(text, target);
//   console.log(`Text: ${text}`);
//   console.log(`Translation: ${translation}`);
//   res.send({ output: translation });
// });

// //Get photos from Mongoose and post photos to Mongoose, using web lab catbook api methods for stories as a model copied from api.js
// router.get("/photos", (req, res) => {
//   // if no more info will get all photos
//   // will actually photo for certain user/friends and
//   // certain  difficulty/etc.
//   Photo.find({}).then((photos) => res.send(photos));
// });
