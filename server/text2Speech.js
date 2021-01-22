// code from https://medium.com/javascript-in-plain-english/a-complete-guide-to-build-text-to-speech-software-with-google-cloud-and-node-js-a28f6b81f8f5
const textToSpeech = require("@google-cloud/text-to-speech");
const util = require("util");
const fs = require("fs");
// const projectId = "AIzaSyCpvFQbOo872Fg0VbTYIjYFEBwKQlnd95w";
// const keyFilename = "../google_cloud_credentials.json";

// TODO: replace this projectId with your own GCP project id!
const text2SpeechInfo = { projectId: "angelic-cat-301602" };
console.log("***adding GCP keys***:::", process.env.GCP_PRIVATE_KEY, process.env.GCP_CLIENT_EMAIL);
if (process.env.GCP_PRIVATE_KEY && process.env.GCP_CLIENT_EMAIL) {
  console.log("***adding GCP keys***:::");
  text2SpeechInfo.credentials = {
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: process.env.GCP_CLIENT_EMAIL,
  };
}

const client = new textToSpeech.TextToSpeechClient(text2SpeechInfo);
// const client = new textToSpeech.TextToSpeechClient({ projectId, keyFilename });
const YourSetting = fs.readFileSync("setting.json");
async function Text2Speech(YourSetting) {
  const [response] = await client.synthesizeSpeech(JSON.parse(YourSetting));
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(JSON.parse(YourSetting).outputFileName, response.audioContent, "binary");
  console.log(`Audio content written to file: ${JSON.parse(YourSetting).outputFileName}`);
}
Text2Speech(YourSetting);
