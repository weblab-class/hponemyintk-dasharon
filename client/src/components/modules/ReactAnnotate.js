import React, { Component } from 'react'
import Annotation from 'react-image-annotation'

export default class Simple extends Component {
  state = {
    // annotations: [],
    annotation: {}
  }

  onChange = (annotation) => {
    this.setState({ annotation })
  }

  // onSubmit = (annotation) => {
  //   const { geometry, data } = annotation

  //   this.setState({
  //     annotation: {},
  //     annotations: this.state.annotations.concat({
  //       geometry,
  //       data: {
  //         ...data,
  //         id: Math.random()
  //       }
  //     })
  //   })
  // }

  onTmpSubmit = (annotation) => {
    this.props.onTagSubmit(annotation);
    this.setState({
      annotation: {},
    });
  }

  render () {
    return (
      <Annotation
        src={"https://upload.wikimedia.org/wikipedia/en/d/d4/Mickey_Mouse.png"}
        alt='Two pebbles anthropomorphized holding hands'

        annotations={this.props.annotationslst}

        type={this.state.type}
        value={this.state.annotation}
        onChange={this.onChange}
        onSubmit={this.onTmpSubmit}
        allowTouch
      />
    )
  }
}
