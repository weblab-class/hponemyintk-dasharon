import React, { Component } from "react";
import Annotation from "react-image-annotation";

export default class Simple extends Component {
  state = {
    // annotations: [],
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

  //render with or without an option to edit with a tag
  render() {
    //if edits are allowed return with an onChange
    if (this.props.allowEdits) {
      return (
        <Annotation
          src={this.props.img_using} //use the input image 1/13/21 edit
          // alt='Two pebbles anthropomorphized holding hands'
          //removed alt 1/13 so it gets replaced by image
          annotations={this.props.annotationslst}
          type={this.state.type}
          value={this.state.annotation}
          onChange={this.onChange}
          onSubmit={this.onTmpSubmit}
          allowTouch
        />
      );
    }

    //if edits not allowed return without an onChange and an onSubmit
    else {
      return (
        <Annotation
          src={this.props.img_using} //use the input image 1/13/21 edit
          // alt='Two pebbles anthropomorphized holding hands'
          //removed alt 1/13 so it gets replaced by image
          annotations={this.props.annotationslst}
          type={this.state.type}
          value={this.state.annotation}
          allowTouch
        />
      );
    }
  }
}
