import React, { Component } from "react";
import "./Image_aesthetics.css";
import "../../utilities.css";
// https://codepen.io/dvdmoon/pen/xNmKLj?editors=0010
import IndividualFlashcard from "./IndividualFlashcard.js";
import MultiColorProgressBar from "../modules/MultiColorProgressBar.js";
import { get, getRandom, getKeyByValue, post, shuffle } from "../../utilities";
import { FlareSharp } from "@material-ui/icons";
import Loading from "./Loading.js";
const clonedeep = require("lodash.clonedeep");
import ReactAnnotate from "./ReactAnnotate.js";

class QuizSelfMade_DS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSet: [],
      onPhoto: 0,
      isDone: false,
      loaded: false,
      showResult: false,
      // for counting correct/inccorect stat in quiz and progress bar
      wasAnswerInput: false,
      regenAnsFlag: true, //check whether you have created an answer array already
      curAnsInfo: [],
      clickedAns: "",
      readings: [
        {
          name: "Correct",
          value: 0,
          percent: 0,
          color: "#5CB85C",
        },
        {
          name: "Incorrect",
          value: 0,
          percent: 0,
          color: "#D9534F",
        },
        {
          name: "Skipped",
          value: 0,
          percent: 0,
          color: "#F0AD4E",
        },
        {
          name: "Unanswered",
          value: 100,
          percent: 100,
          color: "#b9c0c9",
        },
      ],
      filters: {
        // *** Caution!!! be extra careful to set only one of these to true. Otherwise, will only get the first true in the list *** //
        getTenRandom: true,
        mostDifficult: false,
        // leastDifficult: false,
        mostLiked: false,
      },
    };
    this.filterLabels = [
      "Get Ten Random Flashcards",
      "Most Difficult",
      // "Least Difficult",
      "Most Liked",
    ];
    this.langList = {
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
      Chinese: "zh-CN",
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
    };
  } // end constructor

  setRegenFlag = (bool) => {
    this.setState({ regenAnsFlag: bool });
  };

  //change filter values
  handleFilters = (event) => {
    event.preventDefault();
    // make a deep copy of the object list, and set all values to false
    let tmpFilters = clonedeep(this.state.filters);
    for (const [key, value] of Object.entries(tmpFilters)) {
      tmpFilters[key] = false;
    }
    tmpFilters[event.target.value] = true;

    this.setState(
      {
        filters: tmpFilters,
        dataSet: [],
        onPhoto: 0,
        isDone: false,
        loaded: false,
        showResult: false,
        wasAnswerInput: false,
        regenAnsFlag: true,
        curAnsInfo: [],
      },
      this.imageLoad
    );
    this.updateProgress(0, 0, 0, 1);
  };

  //when next is pressed, delete from array so next photo is seen
  //using prop function from quiz component
  handleNext = () => {
    !this.state.wasAnswerInput &&
      this.updateProgress(
        this.state.readings[0].value,
        this.state.readings[1].value,
        this.state.readings[2].value + 1,
        this.state.readings[3].value - 1
      );
    this.movetoNextPhoto();
    this.setState({ wasAnswerInput: false, regenAnsFlag: true });
  };

  handleFinish = () => {
    !this.state.wasAnswerInput &&
      this.updateProgress(
        this.state.readings[0].value,
        this.state.readings[1].value,
        this.state.readings[2].value + 1,
        this.state.readings[3].value - 1
      );
    this.setState({ showResult: true, onPhoto: 0 });
  };

  handleRetake = () => {
    this.updateProgress(
      0,
      0,
      0,
      this.state.readings[0].value +
        this.state.readings[1].value +
        this.state.readings[2].value +
        this.state.readings[3].value
    );
    // console.log("In quiz Retake, this.state.readings", this.state.readings);
    this.setState({ isDone: false, showResult: false, wasAnswerInput: false, regenAnsFlag: true });
  };

  handleNewQuiz = () => {
    // reset all the states before requesting another api call via imageLoad to populate the quiz data
    this.setState({
      dataSet: [],
      onPhoto: 0,
      isDone: false,
      loaded: false,
      showResult: false,
      wasAnswerInput: false,
      regenAnsFlag: true,
      curAnsInfo: [],
    });
    this.updateProgress(0, 0, 0, 1);
    this.imageLoad();
  };

  handleClick = (ansString, corAns) => {
    this.setState({
      wasAnswerInput: true,
      regenAnsFlag: false,
      curAnsInfo: [ansString.text === corAns, ansString.text],
      clickedAns: ansString.text,
    }); //Color answers by whether or not they are correct
    if (ansString.text === corAns) {
      this.updateProgress(
        this.state.readings[0].value + 1,
        this.state.readings[1].value,
        this.state.readings[2].value,
        this.state.readings[3].value - 1
      );
    } else {
      this.updateProgress(
        this.state.readings[0].value,
        this.state.readings[1].value + 1,
        this.state.readings[2].value,
        this.state.readings[3].value - 1
      );
    }
  };

  componentDidMount() {
    // remember -- api calls go here!, get call adapted from catbook
    //run get request to get first image of the user, will build up to getting images one by
    //one or all on one page
    //onyl make req if logged in
    if (this.props.userId) {
      this.imageLoad();
    } else {
      // console.log("SHOULD LOG OUT");
    }
  }

  // functions to update the progress bar values
  updateProgress = (corCt, incorCt, skipCt, unansCt) => {
    let tmpReadings = clonedeep(this.state.readings);
    tmpReadings[0].value = corCt;
    tmpReadings[1].value = incorCt;
    tmpReadings[2].value = skipCt;
    tmpReadings[3].value = unansCt;
    // update percentages
    tmpReadings[0].percent = (corCt / (corCt + incorCt + unansCt + skipCt)) * 100;
    tmpReadings[1].percent = (incorCt / (corCt + incorCt + unansCt + skipCt)) * 100;
    tmpReadings[2].percent = (skipCt / (corCt + incorCt + unansCt + skipCt)) * 100;
    tmpReadings[3].percent = (unansCt / (corCt + incorCt + unansCt + skipCt)) * 100;
    this.setState({ readings: tmpReadings });
  };

  //redo get request if previously failed, many thanks to Nikhil for explaining in 1/15 office hours
  componentDidUpdate(prevProps) {
    if (this.props.userId && prevProps.userId !== this.props.userId) {
      this.imageLoad();
    } else {
      // console.log("SHOULD LOG OUT");
    }
  }

  //pass as prop to individual flashcard components
  //take in photo id
  //many thanks to Jess, this should delete 1 photo then another should show up
  movetoNextPhoto = () => {
    // this.setState({
    //   photo_info_array : this.state.dataSet.filter((p) => (p._id !== photoforDeletion))
    // })
    // console.log("starting movetonextphoto");
    if (this.state.onPhoto < this.state.dataSet.length - 1) {
      this.setState({ onPhoto: this.state.onPhoto + 1 });
    }
    if (this.state.onPhoto === this.state.dataSet.length - 2) {
      this.setState({ isDone: true });
    }
    // console.log("CHANGING ON PHOTO TO", this.state.onPhoto);
  };

  //pass as prop to individual flashcard components
  //take in photoid and rating and update difficulty rating
  //update the dataset with the new rating
  updateDifficulty = (difficultyRating, phototoEdit) => {
    // console.log("difficulty", difficultyRating, "for", phototoEdit._id);
    post("/api/difficultyRating", {
      difficultyRating: difficultyRating,
      photoId: phototoEdit._id,
    }).then((photoUpdated) => {
      let newDataset = clonedeep(this.state.dataSet);
      for (
        let pp = 0;
        pp < newDataset.length;
        pp++ //go through each dataset entry
      ) {
        if (newDataset[pp].photoData._id === phototoEdit._id) {
          //when find the array entry fixed, set it to be the revised entry
          (newDataset[pp].photoData.difficulty = photoUpdated.difficulty), //update the photo field of the dataset
            (newDataset[pp].photoData.photo_placeholder = this.state.dataSet[
              pp
            ].photoData.photo_placeholder); //fix photo placeholder so don't repeat mongoose call
          newDataset[pp].photoData.difficultyRatings = photoUpdated.difficultyRatings; //fix annotations so only one per photo
          // console.log("UPDATED", newDataset[pp].photoData._id, "ENTRY", pp);
        }
      }
      this.setState({ dataSet: newDataset });
    });
  };

  //pass as prop to individual flashcard components
  //take in photoid and rating and whether the user wants to like or unlike, and updates the likes
  updateLikes = (phototoEdit, liking) => {
    const annotArrayOld = clonedeep(phototoEdit.annotation_info_array); //store old annotation array
    // console.log("NEED TO LIKE?", liking);
    // console.log("NEED TO UNLIKE?", !liking);
    post("/api/likingRating", { photoId: phototoEdit._id, addLike: liking }).then(
      (photoUpdated) => {
        let newDataset = clonedeep(this.state.dataSet);
        for (
          let pp = 0;
          pp < newDataset.length;
          pp++ //go through each dataset entry
        ) {
          if (newDataset[pp].photoData._id === phototoEdit._id) {
            //when find the array entry fixed, set it to be the revised entry
            (newDataset[pp].photoData.likeCount = photoUpdated.likeCount), //update the photo field of the dataset
              (newDataset[pp].photoData.photo_placeholder = this.state.dataSet[
                pp
              ].photoData.photo_placeholder), //fix photo
              //placeholder so don't repeat mongoose call/more gcp calls
              (newDataset[pp].photoData.usersLikingArray = photoUpdated.usersLikingArray);
            //newDataset[pp].photoData.annotation_info_array = this.state.dataSet[pp].photoData.annotation_info_array //fix annotations so only one per photo
            // console.log(
            //   "UPDATED",
            //   newDataset[pp].photoData._id,
            //   "ENTRY",
            //   pp,
            //   "GEOM",
            //   newDataset[pp].photoData.annotation_info_array[0].geometry,
            //   "LEARNING LANGUAGE tag",
            //   newDataset[pp].photoData.annotation_info_array[0].data.learningLanguageTag,
            //   "CORRECT",
            //   newDataset[pp].correctAnswer
            // );
          }
        }
        this.setState({ dataSet: newDataset });
      }
    );
  };

  prepQuizSet = (ImageInfo) => {
    let photoLimforQuiz = 10;
    let questionArray = [];

    let goodTagCount = 0; //tracks questions added to quiz
    //loop through each photo
    for (let ii = 0; ii < ImageInfo.length; ii++) {
      //get the entire array set up, and then will edit each photoData object so only 1 annotation is recorded in each entry
      //and shuffle
      let allAnnotArray = shuffle(ImageInfo[ii].annotation_info_array);
      //loop through each annotation

      //counter of annotations for this photo already added
      let annotationsforPhoto = 0;
      for (let annot = 0; annot < ImageInfo[ii].annotation_info_array.length; annot++) {
        //nested spread operator, will this copy everything?
        // let newPhotoInfo = {...ImageInfo[ii], annotation_info_array: {...ImageInfo[ii].annotation_info_array, geometry : {...ImageInfo[ii].annotation_info_array.geometry}, data : {...ImageInfo[ii].annotation_info_array.data}} }; //make a copy of object
        //ref https://stackoverflow.com/questions/39968366/how-to-deep-copy-a-custom-object-in-javascript
        //let newPhotoInfo = Object.assign(ImageInfo[ii]);
        const newPhotoInfo = clonedeep(ImageInfo[ii]); //ref https://flaviocopes.com/how-to-clone-javascript-object/
        newPhotoInfo.annotation_info_array = [allAnnotArray[annot]]; //replace the copy's annotation with just 1 annotation
        //for each annotation/photo pair, recond. make this an array to work with the IndividualFlashcard.js function

        //record correct anser and change tag
        const correctAnswer = newPhotoInfo.annotation_info_array[0].data.learningLanguageTag; //get correct answer
        const ogTag = newPhotoInfo.annotation_info_array[0].data.nativeLanguageTag; //get original tag in user's native language
        const langInterest = newPhotoInfo.translatedLanguage; //grab the 2 character code for the language the user is learning
        const langInterestLong = getKeyByValue(this.langList, langInterest);

        newPhotoInfo.annotation_info_array[0].data.text = "Please select the correct answer!"; //change the text

        //maybe only go here if correctAnswer has 1-2 words?
        // https://www.sketchengine.eu/spanish-word-list/
        const onewordwrongAnswers = [
          "那",
          "的",
          "的",
          "的",
          "通过",
          "带有",
          "对于",
          "一个",
          "如",
          "加",
          "东",
          "但",
          "其",
          "是",
          "他们是",
          "上",
          "之间",
          "成为",
          "是",
          "无",
          "所有",
          "太",
          "以来",
          "什么时候",
          "非常",
          "年份",
          "是",
          "每个人",
          "有",
          "有",
          "我们",
          "为什么",
          "二",
          "直到",
          "哪里",
          "部分",
          "所以",
          "汉",
          "可能",
          "年",
          "每",
          "一",
          "时间",
          "好",
          "确实",
          "工作",
          "国民",
          "州",
          "其他",
          "政府",
          "那",
          "天气",
          "进一步",
          "相同",
          "那",
          "做",
          "国家",
          "中",
          "天",
          "非常",
          "寿命",
          "这个",
          "形状",
          "这些",
          "单",
          "人",
          "其他",
          "现在",
          "今天",
          "是",
          "案件",
          "是这样吗",
          "他们",
          "最好",
          "地点",
          "那",
          "哪一个",
          "那",
          "市",
          "一般",
          "世界",
          "总是",
          "减",
          "发展",
          "反对",
          "帐户",
          "三",
          "看",
          "加",
          "更高",
          "其他",
          "许多",
          "说过",
          "有",
          "是",
          "总统",
          "之前",
          "根据",
          "拥有",
          "第一",
          "是",
          "应该",
          "然后",
          "虽然",
          "法",
          "系统",
          "办法",
          "单",
          "功率",
          "新",
          "他们",
          "所有",
          "社交",
          "信息",
          "时刻",
          "如果不",
          "我们的",
          "其他",
          "之前",
          "然后",
          "这些",
          "某物",
          "有",
          "天",
          "我们的",
          "第一",
          "任何",
          "完成",
          "一点",
          "可能",
          "草案",
          "是",
          "组",
          "是",
          "通过",
          "一些",
          "所以",
          "类",
          "中",
          "人",
          "告诉",
          "设备",
          "新",
          "重要",
          "圣",
          "所有",
          "而",
          "好",
          "中央",
          "协议",
          "程序",
          "健康",
          "过去",
          "公司",
          "许多",
          "结束",
          "内",
          "水平",
          "比赛",
          "服务",
          "屋",
          "教育",
          "服务",
          "安全",
          "处理",
          "小时",
          "的",
          "政治",
          "这样",
          "文章",
          "学院",
          "历史",
          "东东",
          "任何",
          "是",
          "一些",
          "走向",
          "相同",
          "成为",
          "它",
          "主题",
          "怎么样",
          "商业",
          "谢谢",
          "质量",
          "禁运",
          "上市",
          "面前",
          "水",
          "情况",
          "她",
          "社会",
          "我认为",
          "我们",
          "最后",
          "许多",
          "墨西哥",
          "对",
          "区",
          "阿根廷",
          "低",
          "我们",
          "尊重",
          "所以",
          "部门",
          "例",
          "我曾是",
          "后",
          "周",
          "个人",
          "几乎",
          "我们有",
          "资源",
          "不同",
          "他说",
          "时代",
          "点",
          "州",
          "利用",
          "活动",
          "离开",
          "拥有",
          "给",
          "关系",
          "国际",
          "数",
          "月",
          "孩子",
          "它似乎",
          "然而",
          "权利",
          "数据",
          "这里",
          "大",
          "决不",
          "问题",
          "市场",
          "国家",
          "更改",
          "名称",
          "人",
          "我们的",
          "第二",
          "已",
          "感",
          "四个",
          "日期",
          "可能",
          "社区",
          "女人",
          "侧",
          "工作",
          "家庭",
          "一起",
          "导向器",
          "公关" 
        ]; //initial test wrong answers https://www.spanishpod101.com/spanish-word-lists/?page=2 maybe randomly pull 3 for each?
        const twowordwrongAnswers = [
          "两本书",
          "我的朋友",
          "生日快乐",
          "我微笑",
          "早安",
          "美好的一天",
          "很棒的狗",
          "和平生活",
          "美味的苹果",
          "惊人的瀑布",
          "清水",
          "甜芒果",
          "手机",
          "美好的一天",
          "不错的工作",
          "下午好"
        ]; //two word wrong answers, maybe pull three for each
        correctAnswer = correctAnswer.toLowerCase();
        let corAnsLen = correctAnswer.split(" ").length;
        let tmpWrongList = [];
        let uniqueFlag = false;

        //***This should be used only if needed for the language, adding in for Chinese because of space pattern 2/4/21 */
        if (correctAnswer.length > 5)
        {
          continue;
        }
        if (corAnsLen > 2) {
          continue;
        } //if this is longer than 2 words do not show in quiz ref https://www.w3schools.com/java/tryjava.asp?filename=demo_continue
        // check to make sure the wrong answers we generated does not contains the correctAnswer for the question
        while (!uniqueFlag) {
          if (corAnsLen == 1) {
            tmpWrongList = getRandom(onewordwrongAnswers, 3);
          } else {
            tmpWrongList = getRandom(twowordwrongAnswers, 3);
          }
          if (tmpWrongList.indexOf(correctAnswer) >= 0) {
            uniqueFlag = false;
          } else {
            uniqueFlag = true;
          }
        }

        let questionObject = {
          photoData: newPhotoInfo, //record this photo with only the new 1 annotation- not all
          //annotationtoDisplay: ImageInfo[ii].annotation_info_array[annot], //record this annotation
          correctAnswer: correctAnswer,

          //Maybe add in a check of how many words are in the correct answer, and if there are 1 or 2, randomly select 3 choice from the appropriate array above?

          wrongAnswers: tmpWrongList,
          ogTag: ogTag,
          langInterestLong: langInterestLong,
        }; //initial test wrong answers https://www.spanishpod101.com/spanish-word-lists/?page=2 maybe randomly pull 3 for each?

        // console.log(questionObject);

        //run concatentation once in each inner for loop
        questionArray = questionArray.concat(questionObject);
        goodTagCount = goodTagCount + 1; //how many tags added?
        annotationsforPhoto = annotationsforPhoto + 1; //how many annotations added?
        if (goodTagCount > photoLimforQuiz - 1) {
          break;
        }
        if (annotationsforPhoto > 2) {
          break;
        }
      }
      // console.log("questionArray", questionArray);
      if (goodTagCount > photoLimforQuiz - 1) {
        break;
      }
    }

    // Initialize the total unanswered questions stat in readings array for the progress bar
    this.updateProgress(
      this.state.readings[0].value,
      this.state.readings[1].value,
      this.state.readings[2].value,
      questionArray.length
    );
    // console.log("this.state.readings", this.state.readings);

    //shuffle array to make different photos appear ref https://flaviocopes.com/how-to-shuffle-array-javascript/
    //https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
    for (let iii = questionArray.length - 1; iii > 0; iii--) {
      const jjj = Math.floor(Math.random() * iii);
      const temp = questionArray[iii];
      questionArray[iii] = questionArray[jjj];
      questionArray[jjj] = temp;
    }
    // console.log("question array", questionArray);
    this.setState({
      dataSet: questionArray,
      loaded: true,
    });
  };

  //split into a new function as in Nikhil's gcp code, and also if only want one image (for Friends pages) only give one image
  imageLoad = async () => {
    // console.log("calling image load*****");
    //Find user whose photos we are seeing

    //get photo array and add in some wrong answers
    //set the state to be this list of question objects
    //would be great to get each annotation as a separate object
    let ImageInfo = []; // set allUsers to be none before any api calls
    const photoLim = 10; // How many photo to grab per get request
    const startInd = 0; // skip all the initial items in the list until we get to Ind
    // check which flag is set true
    for (let filter of Object.keys(this.state.filters)) {
      //ref: https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
      if (filter === "getTenRandom" && this.state.filters[filter]) {
        const ImageInfo = await get("/api/photosforquiz");
        return this.prepQuizSet(ImageInfo);
      }

      if (filter === "mostDifficult" && this.state.filters[filter]) {
        ImageInfo = await get("/api/photoFilter", {
          sortString: "difficulty",
          sortFlag: -1,
          startInd: startInd,
          lim: photoLim,
          keyname: "goodforQuiz",
          keyvalue: "true",
        });
        return this.prepQuizSet(ImageInfo);
      }

      if (filter === "leastDifficult" && this.state.filters[filter]) {
        // console.log(filter === "leastDifficult", filter);
        ImageInfo = await get("/api/photoFilter", {
          sortString: "difficulty",
          sortFlag: 1,
          startInd: startInd,
          lim: photoLim,
          keyname: "goodforQuiz",
          keyvalue: "true",
        });
        return this.prepQuizSet(ImageInfo);
      }

      if (filter === "mostLiked" && this.state.filters[filter]) {
        ImageInfo = await get("/api/photoFilter", {
          sortString: "likeCount",
          sortFlag: -1,
          startInd: startInd,
          lim: photoLim,
          keyname: "goodforQuiz",
          keyvalue: "true",
        });
        return this.prepQuizSet(ImageInfo);
      }
    }
  };

  render() {
    //Chatbook login protection
    if (!this.props.userId) return <div>Goodbye! Thank you for using Weworld.</div>; //login protect
    return this.state.loaded ? (
      <>
        {/* check whether we are at the result page already or not */}
        {this.state.showResult ? (
          <div className="u-flex u-flex-justifyCenter" style={{ width: "100%" }}>
            <div className="postColumn u-flex-justifyCenter u-flex-alignCenter">
              <ReactAnnotate
                allowEdits={false}
                img_using="/public/images/Thumbsup1.png"
                alt="Thumbs up image"
                onTagSubmit={this.onTagSubmit}
                annotationslst={[
                  {
                    geometry: {
                      x: 3.690957394330438,
                      y: 9.415243588659273,
                      width: 41.06337645682867,
                      height: 82.9297045934702,
                      type: "RECTANGLE",
                    },
                    data: {
                      text: "恭喜您完成测验！",
                      textforBox: "Congratulations on finishing the quiz!",
                      nativeLanguageTag: "Congratulations on finishing the quiz!",
                      learningLanguageTag: "恭喜您完成测验！",
                      id: 0.8823110495256273,
                    },
                  },

                  {
                    geometry: {
                      x: 54.72347726842387,
                      y: 11.789721369274208,
                      width: 43.67434258992183,
                      height: 79.38570870958011,
                      type: "RECTANGLE",
                    },
                    data: {
                      text: "你做到了！",
                      textforBox: "You did it!",
                      nativeLanguageTag: "You did it!",
                      learningLanguageTag: "你做到了！",
                      id: 0.3233378553013361,
                    },
                  },
                ]}
              />
              <h1 className="u-textCenter">
                Congrats, you are done with the quiz!!! Your score is{" "}
                {Math.round(
                  100 *
                    (this.state.readings[0].value /
                      (this.state.readings[0].value +
                        this.state.readings[1].value +
                        this.state.readings[2].value +
                        this.state.readings[3].value))
                )}
                %
              </h1>
              <div className="u-flex u-flex-justifyCenter" style={{ width: "100%" }}>
                <MultiColorProgressBar readings={this.state.readings} />
                <p></p>
              </div>
              <div className="u-flex u-flex-justifyCenter" style={{ width: "100%" }}>
                <button type="button" className="quizEndButton" onClick={this.handleRetake}>
                  Retake the quiz!
                </button>
                <button type="button" className="quizEndButton" onClick={this.handleNewQuiz}>
                  Try another quiz set!
                </button>
                <p></p>
                <p></p>
                <p></p>
              </div>
            </div>
          </div>
        ) : (
          // if not, show only the progress bar
          <div>
            <div className="u-flexColumn u-flex-alignCenter">
              <MultiColorProgressBar readings={this.state.readings} />
              <form>
                <div className="u-flexColumn u-flex-alignCenter" style={{ width: "100%" }}>
                  <label for="imgFilter">Which image filters do you want?</label>
                  <br />
                  <select onChange={this.handleFilters} id="imgFilter">
                    {/* {console.log(Object.keys(this.state.filters))} */}
                    {Object.keys(this.state.filters).map((ff, ii) => (
                      <option value={ff} key={ii + ff}>
                        {this.filterLabels[ii]}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="u-flex u-flex-justifyCenter">
          {//pass into flashcard (1) the fact this is a quiz (2) photo info (3) wwrong answers (5) go to next photo function
          this.state.dataSet.length > 0 ? (
            !this.state.showResult && (
              <IndividualFlashcard
                forQuiz={true}
                photoFacts={this.state.dataSet[this.state.onPhoto].photoData}
                wrongAnswers={this.state.dataSet[this.state.onPhoto].wrongAnswers}
                correctAnswer={this.state.dataSet[this.state.onPhoto].correctAnswer}
                ogTag={this.state.dataSet[this.state.onPhoto].ogTag}
                langInterestLong={this.state.dataSet[this.state.onPhoto].langInterestLong}
                handleClick={this.handleClick}
                handleNext={this.handleNext}
                handleFinish={this.handleFinish}
                wasAnswerInput={this.state.wasAnswerInput}
                curAnsInfo={this.state.curAnsInfo}
                isDone={this.state.isDone}
                clickedAns={this.state.clickedAns}
                updateDifficulty={this.updateDifficulty}
                viewingUserId={this.props.userId}
                updateLikes={this.updateLikes}
                setRegenFlag={this.setRegenFlag}
                regenAnsFlag={this.state.regenAnsFlag}
              />
            )
          ) : (
            <p>No photos!</p>
          )}
        </div>
      </>
    ) : (
      <Loading />
    );
  }
}

export default QuizSelfMade_DS;
