import React, { Component } from "react";
import Annotation from "react-image-annotation";
import { PointSelector, RectangleSelector, OvalSelector } from "react-image-annotation";
import styled from "styled-components";

const Box = ({ children, geometry, style }) => (
  <div
    style={{
      ...style,
      position: "absolute",
      left: `${geometry.x}%`,
      top: `${geometry.y}%`,
      height: `${geometry.height}%`,
      width: `${geometry.width}%`,
    }}
  >
    {children}
  </div>
);

const Comments = styled.div`
  border: 1px solid black;
  max-height: 80px;
  overflow: auto;
`;

const Comment = styled.div`
  padding: 8px;
  &:nth-child(even) {
    background: rgba(0, 0, 0, 0.05);
  }
  &:hover {
    background: #ececec;
  }
`;

export default class Simple extends Component {
  state = {
    activeAnnotations: [],
    annotation: {},
  };

  onChange = (annotation) => {
    this.setState({ annotation });
  };

  onSubmit = (annotation) => {
    const { geometry, data } = annotation;

    this.setState({
      annotation: {},
      annotations: this.state.annotations.concat({
        geometry,
        data: {
          ...data,
          id: Math.random(),
        },
      }),
    });
  };

  onTmpSubmit = (annotation) => {
    this.props.onTagSubmit(annotation);
    this.setState({
      annotation: {},
    });
  };

  // ********************************************
  // *** for rendering custom text over image ***
  // ********************************************
  renderHighlight = ({ annotation, active }) => {
    const { geometry } = annotation;
    if (!geometry) return null;

    return (
      <Box
        key={annotation.data.id}
        geometry={geometry}
        style={{
          border: "solid 1px black",
          boxShadow: active && "0 0 20px 20px rgba(255, 255, 255, 0.3) inset",
        }}
      >
        Custom Highlight
      </Box>
    );
  };

  // **********************************************
  // *** for hiding overlay when showing images ***
  // **********************************************
  renderOverlay = () => {
    return <></>;
  };

  // ***************************************************
  // *** for rendering text box below annotation box ***
  // ***************************************************
  onMouseOver = (id) => (e) => {
    this.setState({
      activeAnnotations: [...this.state.activeAnnotations, id],
    });
  };

  onMouseOut = (id) => (e) => {
    const index = this.state.activeAnnotations.indexOf(id);

    this.setState({
      activeAnnotations: [
        ...this.state.activeAnnotations.slice(0, index),
        ...this.state.activeAnnotations.slice(index + 1),
      ],
    });
  };

  activeAnnotationComparator = (a, b) => {
    return a.data.id === b;
  };

  //render with or without an option to edit with a tag
  render() {
    let tagText = "Tags:";
    //Decide whether should be tag or tags in text
    // console.log("LIST", this.props.annotationslst);
    if (this.props.annotationslst.length === 1) {
      tagText = "Tag:";
    }
    //if edits are allowed return with an onChange
    if (this.props.allowEdits) {
      return (
        <div>
          <Annotation
            src={this.props.img_using} //use the input image 1/13/21 edit
            // alt='Two pebbles anthropomorphized holding hands'
            //removed alt 1/13 so it gets replaced by image
            annotations={this.props.annotationslst}
            type={this.state.type}
            value={this.state.annotation}
            onChange={this.onChange}
            onSubmit={this.onTmpSubmit}
            activeAnnotationComparator={this.activeAnnotationComparator} // from annotation selector comment box
            activeAnnotations={this.state.activeAnnotations} // from annotation selector comment box
            allowTouch
          />
          
          {(this.props.annotationslst.length === 0) ? (<h4>No tags yet! Please tag away!</h4>) : //only show tags if there are tage to show
          
          (<>
            <h4>{tagText}</h4>
            <Comments>
            {this.props.annotationslst.map((annotation) => (
              <Comment
                onMouseOver={this.onMouseOver(annotation.data.id)}
                onMouseOut={this.onMouseOut(annotation.data.id)}
                key={annotation.data.id}
              >
                {annotation.data.textforBox}
              </Comment>
            ))}
          </Comments></>)
    }
        </div>
      );
    }

    //if edits not allowed return without an onChange and an onSubmit
    else {
      //if hideTagLst flag is on, only show the image without tag list
      return (
        <div>
          <Annotation
            src={this.props.img_using} //use the input image 1/13/21 edit
            // alt='Two pebbles anthropomorphized holding hands'
            //removed alt 1/13 so it gets replaced by image
            annotations={this.props.annotationslst}
            type={this.state.type}
            value={this.state.annotation}
            // renderHighlight={this.renderHighlight} // for adding custom text on annotated image
            activeAnnotationComparator={this.activeAnnotationComparator} // from annotation selector comment box
            activeAnnotations={this.state.activeAnnotations} // from annotation selector comment box
            renderOverlay={this.renderOverlay} // Hide overlay
            allowTouch
          />
          {/* {console.log("this.props.hideTagLst", this.props.hideTagLst)} */}
          {((!this.props.hideTagLst) && (this.props.annotationslst.length !== 0)) && (

            <>
              {/* {console.log("This is when hideTagLst is true in loop", this.props.hideTagLst)} */}
              <h4>{tagText}</h4>
              <Comments>
                {this.props.annotationslst.map((annotation) => (
                  <Comment
                    onMouseOver={this.onMouseOver(annotation.data.id)}
                    onMouseOut={this.onMouseOut(annotation.data.id)}
                    key={annotation.data.id}
                  >
                    {annotation.data.textforBox}
                  </Comment>
                ))}
              </Comments>
            </>
          )}
          {((!this.props.hideTagLst) && (this.props.annotationslst.length === 0)) && (<h4>No tags</h4>)}
        </div>
      );
    }
  }
}
