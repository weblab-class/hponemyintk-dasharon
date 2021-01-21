// translation imports https://cloud.google.com/translate/docs/basic/quickstart
const { Translate } = require("@google-cloud/translate").v2;

// From Nikhil's https://github.com/weblab-workshops/gcp-example, comments copied (another ref: https://cloud.google.com/docs/authentication/production#passing_code)
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

//this is from https://googleapis.dev/nodejs/translate/latest/
async function quickStart() {
    // The text to translate
    // const text = 'Hello, world!';
  
    // // The target language
    // const target = 'ru';
  
    // // Translates some text into Russian
    // const [translation] = await translate.translate(text, target);
    // console.log(`Text: ${text}`);
    // console.log(`Translation: ${translation}`);
    // return translation;
    return "Reached translation";
  }

  async function quickStart2() {
    // The text to translate
    // const text = 'Hello, world!';
  
    // // The target language
    // const target = 'ru';
  
    // // Translates some text into Russian
    // const [translation] = await translate.translate(text, target);
    // console.log(`Text: ${text}`);
    // console.log(`Translation: ${translation}`);
    // return translation;
    return "Reached translation 2";
  }
  
  module.exports = {quickStart, quickStart2};