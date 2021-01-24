//ref:https://scriptverse.academy/tutorials/reactjs-multicolor-progressbar.html

import React, { Component } from "react";
import "./MultiColorProgressBar.css";
class MultiColorProgressBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const parent = this.props;

    let values =
      parent.readings &&
      parent.readings.length &&
      parent.readings.map(function(item, i) {
        if (item.percent > 0) {
          return (
            <div className="value" style={{ color: item.color, width: item.percent + "%" }} key={i}>
              <span>{item.value}</span>
            </div>
          );
        }
      }, this);

    let calibrations =
      parent.readings &&
      parent.readings.length &&
      parent.readings.map(function(item, i) {
        if (item.percent > 0) {
          return (
            <div
              className="graduation"
              style={{ color: item.color, width: item.percent + "%" }}
              key={i}
            >
              <span>|</span>
            </div>
          );
        }
      }, this);

    let bars =
      parent.readings &&
      parent.readings.length &&
      parent.readings.map(function(item, i) {
        if (item.percent > 0) {
          return (
            <div
              className="bar"
              style={{ backgroundColor: item.color, width: item.percent + "%" }}
              key={i}
            >
              {/* <span clssName="progValue">{item.value}</span> */}
            </div>
          );
        }
      }, this);

    let legends =
      parent.readings &&
      parent.readings.length &&
      parent.readings.map(function(item, i) {
        if (item.percent > 0) {
          return (
            <div className="legend" key={i}>
              <span className="dot" style={{ color: item.color }}>
                ●
              </span>
              <span className="label">{item.name}</span>
            </div>
          );
        }
      }, this);

    return (
      <div className="multicolor-bar">
        {/* <div className="values">{values == "" ? "" : values}</div>
        <div className="scale">{calibrations == "" ? "" : calibrations}</div> */}
        <div className="legends">{legends == "" ? "" : legends}</div>
        <div className="bars">{bars == "" ? "" : bars}</div>
        {/* <div className="legends">{legends == "" ? "" : legends}</div> */}
      </div>
    );
  }
}

export default MultiColorProgressBar;
