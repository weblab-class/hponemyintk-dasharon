import React, { Component } from "react";
import { Link } from "@reach/router";
import "../../utilities.css";
import "./Skeleton.css";
import "./HomePage.css";

class Home_Page extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    if (!this.props.userId) return <div>Goodbye! Thank you so much for using Weworld.</div>; //login protect
    //tried https://www.w3schools.com/html/html_lists.asp for list but then decided not
    return (
      <div className="u-flex u-flex-justifyCenter">
        <div className="postColumn paddedText">
          {/* Use username prop */}
          <p>Welcome {this.props.username}!</p>
          <p className="questiontext">What is WeWorld?</p>
          <p className="answertext">WeWorld enables you to learn a language through your and others' photos. As you relate the language to your life through photo tags, you will learn and have fun!</p>
          <p className="questiontext">Nice! I am excited to put my selfies to educational use. How can I get started learning from my photos?</p>
          <p className="answertext">On the <Link className = "linktext" to="/Upload">Upload page</Link>, you upload your photos and add tags (currently you have to supply the translation, and we are hoping to implement translation!).
          </p>
          <p className="questiontext">Are my photos private?</p>
          <p className="answertext">Please note currently all users can see everyone's content given this is an early testing version of the website. So please do not share any image or text you do not want shared publicly. Also your timestamp of use and name are recorded and associated with your image.</p>
          <p className="questiontext">So once my photos are uploaded, how can I review them?</p>
          <p className="answertext"> On the {this.props.userId && (
                <Link to={`/Flashcards/${this.props.userId}`} className = "linktext">
                  Review page
                </Link>
              )} you can scroll through all of your photos and review words- as well as your memories.
          </p>
          <p className="questiontext">I'm excited to review, but I want a challenge and to really learn. Can I test myself?</p>
          <p className="answertext">You will soon be able to! Our <Link to="/Quiz" className = "linktext">Quizzes page </Link>shows the quiz module (right now with a sample history lesson) which we hope to implement, where you will have to pick the word corresponding to a tag in a photo.</p>
          <p className="questiontext">Now, you also said this is social? Can I see my friends' adorable pet* pictures and learn from them?</p>
          <p className="answertext">Yup! The <Link to="/Friends" className = "linktext"> Social page </Link> shows a photo for each WeWorld user and has a link for you to see all of their photos.</p>
          <p className="questiontext">What if I see troubling or inappropriate content uploaded by another user?</p>
          <p className="answertext">WeWorld wants to ensure it is a welcoming and inclusive website. Please email us at weblab2021@gmail.com, so we can look into and address your concern.</p>
          <p className="questiontext">I want inspiration, though! The idea of using my photos as a tool to help teach me a language is really new to me. How do I know which kinds of photos to upload?</p>
          <p className="answertext">We are thinking of adding a <Link to="/Scavenger_Hunts" className = "linktext"> Scavenger Hunts page</Link>, which would provide photo prompts to get the learning and fun started!</p>
          <p>*WeWorld likes animals of all kinds, including both cats and dogs!</p>
          <p></p>
          <img src="https://powerlanguage.net/wp-content/uploads/2019/09/welcome.jpg" />
        </div>
      </div>
    );
  }
}

export default Home_Page;
