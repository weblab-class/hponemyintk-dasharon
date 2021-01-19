We thank the web.lab instructors and Dr. Anindya Roy<br/>

What is WeWorld?<br/>
WeWorld enables you to learn a language through your and others' photos. As you relate the language to your life through photo tags, you will learn and have fun!<br/>

Nice! I am excited to put my selfies to educational use. How can I get started learning from my photos?<br/>
On the Upload page, you upload your photos and add tags (currently you have to supply the translation, and we are hoping to implement translation!).<br/>

Are my photos private?
Please note currently all users can see everyone's content given this is an early testing version of the website. So please do not share any image or text you do not want shared publicly. Also your timestamp of use and name are recorded and associated with your image.

So once my photos are uploaded, how can I review them?
On the Review page you can scroll through all of your photos and review words- as well as your memories.

I'm excited to review, but I want a challenge and to really learn. Can I test myself?
You will soon be able to! Our Quizzes page shows the quiz module (right now with a sample history lesson) which we hope to implement, where you will have to pick the word corresponding to a tag in a photo.

Now, you also said this is social? Can I see my friends' adorable pet\* pictures and learn from them?
Yup! The Social page shows a photo for each WeWorld user and has a link for you to see all of their photos.

What if I see troubling or inappropriate content uploaded by another user?
WeWorld wants to ensure it is a welcoming and inclusive website. Please email us at weblab2021@gmail.com, so we can look into and address your concern.

I want inspiration, though! The idea of using my photos as a tool to help teach me a language is really new to me. How do I know which kinds of photos to upload?
We are thinking of adding a Scavenger Hunts page, which would provide photo prompts to get the learning and fun started!
\*WeWorld likes animals of all kinds, including both cats and dogs!

Keys modules/code sources which we used from other sources are:
-web.lab catbook code: https://github.com/weblab-workshops/catbook-react
-Nikhil's gcp code: https://github.com/weblab-workshops/gcp-example
-react-image-annotation: https://www.npmjs.com/package/react-image-annotation
-SurveyJS: https://surveyjs.io/Examples/Library?id=survey-quiz&platform=Reactjs&theme=modern
-Ratings: https://material-ui.com/api/rating/, https://material-ui.com/components/rating/,
-References on inputting text/images: https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa*/, https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag
-Also hoping to use translation module such as https://cloud.google.com/translate/docs/basic/quickstart

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
