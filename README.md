This document has the questions and answers on our FAQ page and also has citations for key code/package sources, as well as the initial text from the web.lab README file. We thank the web.lab instructors and test users for all of their help and advice!

### What is WeWorld?

WeWorld enables you to learn a language through your and others' photos. (Currently only Spanish is supported.) As you relate
the language to your life through photo tags, you will learn and have fun!

### Nice! I am excited to put my selfies to educational use. How can I get started learning from my photos?

On the Upload page, you upload your photos and add tags in your native language or the language in which
you feel most comfortable learning. A translation will be provided for you and placed in
the tag, along with your original input! You can also rate the photo's difficulty, like the photo, and add a caption (which will be translated as well).

### Are my photos private?</p>

Please note all users can see everyone's content. So please do not share any image or text you do not want shared publicly. Also your timestamp of use and name are recorded and associated with your image.

### I want a challenge and to really learn. Can I test myself?

Our Quizzes page has questions to test your knowledge, where you will have to pick the word corresponding to a tag in a photo.

### Now, you also said this is social? Can I see my friends' adorable pet pictures and learn from them?

Yup! The Social page has other WeWorld users' photos. There are several different viewing settings (including most liked, most difficult, and most commented).

### How can I review my past activity?

On the Review page you can scroll through all of your photos and review words- as well as your memories. You can also review photos you liked, commented on, or rated the difficulty of.

### What are the different ways I can interact with a photo?

You can like photos and rate their difficulty when uploading, taking the quiz, or viewing (in Social or Review). Also, when viewing (in Social or Review), you can comment on a photo. When viewing photos, please note that a difficulty of 0 means a photo's difficulty has not yet been rated (difficulty is on a scale of 1 to 5).

### How can I control whether I see tags/text in English or Spanish?

When viewing (in Social or Review), you can select the translation icon to flip between viewing in English and in Spanish. The tag text below the image will be in one language, and the tag text on the image will be in the other language.

### What if I see troubling or inappropriate content uploaded by another user?

WeWorld wants to ensure it is a welcoming and inclusive website. Please email us at weblab2021 at gmail.com, so we can look into and address your concern.

### How did WeWorld come about?</p>

WeWorld is our MIT web.lab course project. We are very grateful to the course team and our test users for their help and advice with this project!

### Keys modules/code sources which we used from other sources are:

- web.lab catbook code: https://github.com/weblab-workshops/catbook-react, including comments portion
- Nikhil's gcp code: https://github.com/weblab-workshops/gcp-example
- react-image-annotation: https://www.npmjs.com/package/react-image-annotation
- We looked into but did not use SurveyJS: https://surveyjs.io/Examples/Library?id=survey-quiz&platform=Reactjs&theme=modern and found this quiz code https://codepen.io/dvdmoon/pen/xNmKLj?editors=0010 to be very helpful and used some of it
- Ratings: https://material-ui.com/api/rating/, https://material-ui.com/components/rating/,
- References on inputting text/images: https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa*/, https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag
- Google Translate: https://cloud.google.com/translate/docs/basic/quickstart
- We took icons from Material-UI (https://material-ui.com/components/material-icons/), fontawesome (https://fontawesome.com), and favicon (https://favicon.io/emoji-favicons/globe-showing-americas)
- We are using React: https://reactjs.org
- Citations are often provided in the code as well

#Below information is from the course team and was in the initial README.md:

# Project Skeleton

## What we provide

- Google Auth (Skeleton.js & auth.js)
  - Disclaimer: Auth isn't being taught until the second week.
- Socket Infrastructure (client-socket.js & server-socket.js)
  - Disclaimer: Socket isn't being taught until the second week.
- User Model (auth.js & user.js)

## What you need to change

- Change the font in utilities.css
- Change the Frontend CLIENT_ID for Google Auth (Skeleton.js) (we'll talk about it at the end of week 2)
- Change the Server CLIENT_ID for Google Auth (auth.js) (we'll talk about it at the end of week 2)
- Change the Database SRV for Atlas (server.js)
- Change the Database Name for MongoDB (server.js)
- Add a favicon to your website at the path client/dist/favicon.ico
- Update website title in client/dist/index.html
- Update this README file ;)
- Update the package.json file with your app name :) (line 2)

## Socket stuff

Note: we'll be getting to this in lecture in week 2, so don't worry if you don't know it yet

- If you're not using realtime updating or don't need server->client communication, you can remove socket entirely! (server-socket.js, client-socket.js, and anything that imports them)
- If you are using socket, consider what you want to do with the FIXME in server-socket.js

## How to integrate into your own project

On GitHub download this repository as a zip file, then extract the files into your own repository.
Warning: make sure you copy the hidden files too: .babelrc, .gitignore, .npmrc, and .prettierrc

## don't touch

the following files students do not need to edit. feel free to read them if you would like.

```
client/src/index.js
client/src/utilities.js
client/src/client-socket.js
server/validator.js
server/server-socket.js
.babelrc
.npmrc
.prettierrc
package-lock.json
webpack.config.js
```

## Good luck on your project :)
