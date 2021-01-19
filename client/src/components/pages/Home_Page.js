import React, { Component } from "react";
import { Link } from "@reach/router";
import "../../utilities.css";
import "./Skeleton.css";

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
    //https://www.w3schools.com/html/html_lists.asp for list
    return (
      <div className="u-flex u-flex-justifyCenter">
        <div className="postColumn paddedText">
          {/* Use username prop */}
          <p>Welcome {this.props.username}!</p>
          <p>What is WeWorld?</p>
          <p>WeWorld enables you to learn a language through your and others' photos. As you relate the language to your life through photo tags, you will learn and have fun!</p>
          <p>Nice! I am excited to put my selfies to educational use. How can I get started learning from my photos?</p>
          <p>On the <Link to="/Upload">Upload page</Link>, you upload your photos and add tags (currently you have to supply the translation, and we are hoping to implement translation!)
          </p>
          <p>Cool! So once my photos are uploaded, how can I review them?</p>
          <p> On the {this.props.userId && (
                <Link to={`/Flashcards/${this.props.userId}`}>
                  Review page
                </Link>
              )} you can scroll through all of your photos and review words- as well as your memories.
          </p>
          <p>I'm excited to review, but I want a challenge and to really learn. Can I test myself?</p>
          <p>You will soon be able to! Our <Link to="/Quiz">Quizzes page </Link>shows the quiz module (right now with a sample history lesson) which we hope to implement, where you will have to pick the word corresponding to a tag in a photo</p>
          <p>Now, you also said this is social? Can I see my friends' adorable pet* pictures and learn from them?</p>
          <p>Yup! The Social page...</p>
          <p>*WeWorld accepts animals of all kinds. Both cats and dogs are welcome!</p>
          <p></p>
          <img src="https://powerlanguage.net/wp-content/uploads/2019/09/welcome.jpg" />
        </div>
      </div>
    );
  }
}

export default Home_Page;
