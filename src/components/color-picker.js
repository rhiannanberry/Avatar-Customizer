import * as THREE from "three";
import React, { Component } from "react";
import PropTypes from "prop-types";

export class ColorPicker extends Component {
  static propTypes = {
    defaultColor: PropTypes.string,
    material: PropTypes.object,
    disabled: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      color: props.defaultColor
    };
    this.colorPicker = React.createRef();
  }

  onUpdateColor(e) {
    this.setState({ color: e.target.value });
    this.updateMaterial();
  }

  updateMaterial() {
    if (this.props.material.color == new THREE.Color(this.state.color)) return;
    this.props.material.color = new THREE.Color(this.state.color);
    this.props.material.needsUpdate = true;
  }

  randomize() {
    const clr = new THREE.Color(0, 0, 0).setHex(Math.random() * 0xffffff);
    this.setState({ color: "#" + clr.getHexString() });
  }

  render() {
    this.updateMaterial();
    return (
      <div>
        <input
          ref={this.colorPicker}
          className="color-picker"
          name="Color Picker"
          type="color"
          disabled={this.props.disabled}
          value={this.state.color}
          onInput={this.onUpdateColor.bind(this)}
          onChange={this.onUpdateColor.bind(this)}
        />
      </div>
    );
  }
}
