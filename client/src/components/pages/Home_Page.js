import React, { Component } from "react";
import { Link } from "@reach/router";
import "../../utilities.css";
import "./Skeleton.css";
import "./HomePage.css";
import { get, post } from "../../utilities";
import ReactAnnotate from "../modules/ReactAnnotate.js";
import Goodbye from  "./Goodbye.js"
import "../modules/Image_aesthetics.css"

class Home_Page extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      photo_info_array: [], //this is a photo info array};
      langList: {
        Afrikaans: "af",
        Albanian: "sq",
        Amharic: "am",
        Arabic: "ar",
        Armenian: "hy",
        Azerbaijani: "az",
        Basque: "eu",
        Belarusian: "be",
        Bengali: "bn",
        Bosnian: "bs",
        Bulgarian: "bg",
        Burmese: "my",
        Catalan: "ca",
        Cebuano: "ceb",
        Chinese_Simplified: "zh-CN",
        Chinese_Traditional: "zh-TW",
        Corsican: "co",
        Croatian: "hr",
        Czech: "cs",
        Danish: "da",
        Dutch: "nl",
        English: "en",
        Esperanto: "eo",
        Estonian: "et",
        Filipino: "tl",
        Finnish: "fi",
        French: "fr",
        Frisian: "fy",
        Galician: "gl",
        Georgian: "ka",
        German: "de",
        Greek: "el",
        Gujarati: "gu",
        Haitian: "ht",
        Hausa: "ha",
        Hawaiian: "haw",
        Hebrew: "he",
        Hindi: "hi",
        Hmong: "hmn",
        Hungarian: "hu",
        Icelandic: "is",
        Igbo: "ig",
        Indonesian: "id",
        Irish: "ga",
        Italian: "it",
        Japanese: "ja",
        Javanese: "jv",
        Kannada: "kn",
        Kazakh: "kk",
        Khmer: "km",
        Kinyarwanda: "rw",
        Korean: "ko",
        Kurdish: "ku",
        Kyrgyz: "ky",
        Lao: "lo",
        Latin: "la",
        Latvian: "lv",
        Lithuanian: "lt",
        Luxembourgish: "lb",
        Macedonian: "mk",
        Malagasy: "mg",
        Malay: "ms",
        Malayalam: "ml",
        Maltese: "mt",
        Maori: "mi",
        Marathi: "mr",
        Mongolian: "mn",
        Nepali: "ne",
        Norwegian: "no",
        Nyanja: "ny",
        Odia: "or",
        Pashto: "ps",
        Persian: "fa",
        Polish: "pl",
        Portuguese: "pt",
        Punjabi: "pa",
        Romanian: "ro",
        Russian: "ru",
        Samoan: "sm",
        ScotsGaelic: "gd",
        Serbian: "sr",
        Sesotho: "st",
        Shona: "sn",
        Sindhi: "sd",
        Sinhalese: "si",
        Slovak: "sk",
        Slovenian: "sl",
        Somali: "so",
        Spanish: "es",
        Sundanese: "su",
        Swahili: "sw",
        Swedish: "sv",
        Tajik: "tg",
        Tamil: "ta",
        Tatar: "tt",
        Telugu: "te",
        Thai: "th",
        Turkish: "tr",
        Turkmen: "tk",
        Ukrainian: "uk",
        Urdu: "ur",
        Uyghur: "ug",
        Uzbek: "uz",
        Vietnamese: "vi",
        Welsh: "cy",
        Xhosa: "xh",
        Yiddish: "yi",
        Yoruba: "yo",
        Zulu: "zu",
      },
      languageSelected: "",
      welcomeText: "",
      name: "",
      loading: true
    };
  }

  componentDidMount() {
    // remember -- api calls go here!, get call adapted from catbook
    //run get request to get first image of the user, will build up to getting images one by
    //one or all on one page
    //onyl make req if logged in
    // if (this.props.userId) {
    //   this.imageLoad();
    // } else {
    //   console.log("SHOULD LOG OUT");
    // }
    this.setState({loading: false})
  }

  //redo get request if previously failed, many thanks to Nikhil for explaining in 1/15 office hours
  componentDidUpdate(prevProps) {
    // if (this.props.userId && prevProps.userId !== this.props.userId) {
    //   this.imageLoad();
    // } else {
    //   console.log("SHOULD LOG OUT");
    // }
  }

  //split into a new function as in Nikhil's gcp code, and also if only want one image (for Friends pages) only give one image
  // imageLoad = () => {
  //   console.log("calling image load*****");
  //   //see if logged in
  //   // get("/api/whoami").then((user) => {
  //   //   if (user._id) {
  //   //     // they are registed in the database, and currently logged in.
  //   //     this.setState({ stillLoggedIn: true });
  //   //   } else {
  //   //     this.setState({ stillLoggedIn: false });
  //   //   }
  //   // });
  //   //Find user whose photos we are seeing

  //   get("/api/photosimpletestOnebyid", { photoId: "60075dbc90f80b3495af511d" }).then(
  //     (ImageInfo_one) => {
  //       console.log(ImageInfo_one);
  //       this.setState({
  //         photo_info_array: [ImageInfo_one],
  //       });
  //     }
  //   );

  //   //get welcome message and language user is currently learning
  //   get("/api/singleUserFind", { checkUserId: this.props.userId }).then((userData) => {
  //     this.setState({ welcomeText: userData.welcomeMessage });
  //     this.setState({ languageSelected: userData.learningLanguageLong });
  //     this.setState({ name: userData.name });
  //   });
  // };

  //cleans up annotations
  // cleanAnnotInput = (initAnnotInput) => {
  //   initAnnotInput.map((obj) => {
  //     obj.geometry.type = obj.geometry.shape_kind; //[ref: renaming https://stackoverflow.com/questions/4647817/javascript-object-rename-key]
  //     delete obj.geometry.shape_kind;
  //   });
  //   return initAnnotInput;
  // };

  // //give info on a first photo, now as text, would want to translate to picture/rating/annotation/etc.
  // GetPhotoInfo(PhotoInfo) {
  //   //debugging code
  //   // console.log("Initial annotation array");
  //   // console.log(PhotoInfo.annotation_info_array);

  //   //change annotation field so it is type which react-image-annotate needs
  //   let annotPhotoInfo = this.cleanAnnotInput(PhotoInfo.annotation_info_array);

  //   //debugging code
  //   // console.log("Revised annotation array");
  //   // console.log(annotPhotoInfo);

  //   //multiple classes https://stackoverflow.com/questions/11918491/using-two-css-classes-on-one-element https://dev.to/drews256/ridiculously-easy-row-and-column-layouts-with-flexbox-1k01 helped with row and column, other refs in css file
  //   return (
  //     <ReactAnnotate
  //       allowEdits={false}
  //       border-radius="10%"
  //       img_using={PhotoInfo.photo_placeholder}
  //       annotationslst={annotPhotoInfo}
  //       height="100"
  //       width="100"
  //     />
  //   );
  // }


  //change the
  //this.setState({ languageSelected:  event.target.value});
  // console.log();
  // let photoDeleteBody = { deletionId: event.target.value }; //set the request to be for this photo ID
  // post("/api/deletePhoto", photoDeleteBody); //run the delete request
  // alert("Adios photo! Au revoir! Your photo has been deleted");

  //after deletion, send back to where you were (e.g., if you are on your flashcards page return there, and if you are on the friends page go back there)
  // const pageLocation = this.props.location;
  // console.log(pageLocation);
  // console.log(pageLocation.pathname);
  // navigate(pageLocation.pathname);
  //window.location.reload(false); //https://upmostly.com/tutorials/how-to-refresh-a-page-or-component-in-react
  //what we do not want to do
  //(this.props.onlyOne) ? (navigate("/Flashcards/"+this.state.requestingUserId)) : (navigate("/Friends"));
  //alert("Delete" + photoToDelete.caption_text_s);
  //event.preventDefault();
  //};

  render() {
    if (!this.props.userId) return <div><Goodbye/></div>; //login protect
    //tried https://www.w3schools.com/html/html_lists.asp for list but then decided not
    return (
      <div className="u-flexColumn u-flex-alignCenter" style={{ width: "100%" }}>
        <p>Welcome {this.props.name}!</p>
        <div className="u-flex u-flex-justifyCenter" style={{ width: "100%" }}>
        {/* <div className="row post">
          <div className="center_image responsive"> */}

        {/*The annotated image*/}
        <div className="post">
        <div className="postLeft">
            {/* <div> */}
            <ReactAnnotate
              allowEdits={false}
              border-radius="10%"
              img_using="/public/images/DemoforHomepage.jpg"
              alt="Upload demo photo"
              annotationslst={[{
                "geometry": {
                  "x": 2.972398878069434,
                  "y": 40.89119583876739,
                  "width": 55.95996282631367,
                  "height": 56.31812746011016,
                  "type": "RECTANGLE"
                },
                "data": {
                  "text": "¡Subes fotos!",
                  "textforBox": "You upload photos!",
                  "nativeLanguageTag": "You upload photos!",
                  "learningLanguageTag": "¡Subes fotos!",
                  "id": 0.5894362203517878
                }
              }]}
              height="300"
              width="300"
            />
          </div>

          {/* info on submission-user nam link to profileandddate*/}
          <div className="postRight">
          {/* Use username state */}
   <p>First, you can             <Link className="hplinktext" to="/Upload">
              upload photos
            </Link> to translate moments from your world into Spanish!</p>

        </div>
        </div>
        </div>






        <div className="u-flex u-flex-justifyCenter" style={{ width: "100%" }}>
        {/* <div className="row post">
          <div className="center_image responsive"> */}

        {/*The annotated image*/}
        <div className="post">
        <div className="postLeft">
        <ReactAnnotate
              allowEdits={false}
              border-radius="10%"
              img_using="/public/images/QuizforHomepage.jpg"
              alt="Quiz demo photo"
              annotationslst={[{
                "geometry": {
                  "x": 22.763117438595003,
                  "y": 49.6663615217506,
                  "width": 49.818015686840226,
                  "height": 46.40582175772727,
                  "type": "RECTANGLE"
                },
                "data": {
                  "text": "¡Responde cuestionarios!",
                  "textforBox": "You take quizzes!",
                  "nativeLanguageTag": "You take quizzes!",
                  "learningLanguageTag": "¡Responde cuestionarios!",
                  "id": 0.17849538622696215
                }
              }]}
              height="300"
              width="300"
            />
          </div>
          <div className="postRight">
{/* Use username state */}
<p>Next, you can take {" "}
            <Link to="/QuizSelfMade_DSs" className="hplinktext">
              quizzes 
            </Link> {" "}to expand your universe of knowledge using a broad range of pictures!</p>

</div>
</div>
</div>


<div className="u-flex u-flex-justifyCenter" style={{ width: "100%" }}>
        {/* <div className="row post">
          <div className="center_image responsive"> */}

        {/*The annotated image*/}
        <div className="post">
        <div className="postLeft">
        <ReactAnnotate
              allowEdits={false}
              border-radius="10%"
              img_using="/public/images/FlashCardforHomepage.jpg"
              alt="Flashcard demo photo"
              annotationslst={[{
                "geometry": {
                  "x": 25.037912675437024,
                  "y": 53.002727791914,
                  "width": 50.04549521052442,
                  "height": 42.76614946300357,
                  "type": "RECTANGLE"
                },
                "data": {
                  "text": "¡Miras y comentas tus fotos y las de los demás!",
                  "textforBox": "You look through and comment on your and others' photos!",
                  "nativeLanguageTag": "You look through and comment on your and others' photos!",
                  "learningLanguageTag": "¡Miras y comentas tus fotos y las de los demás!",
                  "id": 0.9764706490827654
                }
              }]}
              height="300"
              width="300"
            />
          </div>
          <div className="postRight">
{/* Use username state */}
<p>Afterwards, the {" "}
            <Link to="/Friends" className="hplinktext">
              {" "}
              Social page
            </Link>{" "} provides opportunities to learn from the WeWorld community through reading captions and comments and posting comments! You can also find links to individual user profiles. You can then review your activity on the {" "}
            {this.props.userId && (
              <Link to={`/Flashcards/${this.props.userId}`} className="hplinktext">
                Review page
              </Link>
            )}.</p>
      </div>
      </div>
</div>


<div className="u-flex u-flex-justifyCenter  u-alignCenter" style={{ width: "100%" }}>
        {/* <div className="row post">
          <div className="center_image responsive"> */}

        {/*The annotated image*/}
        <div className="post u-alignCenter" style={{textAlign: "center"}}>

{/* Use username state */}
<p>We hope you learn and have fun! To learn more about WeWorld, you can read the{" "}
                        <Link to="/FAQ" className="hplinktext">
              frequently asked questions
            </Link>.</p>
      </div>

      </div>
      </div>
    );
  }
}

export default Home_Page;
