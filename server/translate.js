// Imports the Google Cloud client library
const { Translate } = require("@google-cloud/translate").v2;

// Creates a client
const translateInfo = { projectId: "angelic-cat-301602" };
if (process.env.GCP_PRIVATE_KEY && process.env.GCP_CLIENT_EMAIL) {
  translateInfo.credentials = {
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: process.env.GCP_CLIENT_EMAIL,
  };
}

const translate = new Translate(translateInfo);

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const text = "The text to translate, e.g. Hello, world!";
const target = "ru";

async function translateText() {
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  let [translations] = await translate.translate(text, target);
  translations = Array.isArray(translations) ? translations : [translations];
  console.log("Translations:");
  translations.forEach((translation, i) => {
    console.log(`${text[i]} => (${target}) ${translation}`);
  });
}

module.exports = { translateText };
