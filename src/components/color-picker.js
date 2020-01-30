import * as THREE from "three";
import React, { Component } from "react";
import PropTypes from "prop-types";

export class ColorPicker extends Component {
  static propTypes = {
    defaultColor: PropTypes.string,
    onChange: PropTypes.func,
    active: PropTypes.bool
  };

  static defaultProps = {
    defaultColor: '#ffffff',
    onChange: () => {}
  }

  constructor(props) {
    super(props);
    this.state = {
      color: props.defaultColor
    };
    this.colorPicker = React.createRef();
  }

  updateColor(e) {
    this.setState({ color: e });
    this.props.onChange(e);
  }
  render() {
    //this.updateMaterial();
    return (  
        <input
          ref={this.colorPicker}
          className="color-picker"
          name="Color Picker"
          type="color"
          disabled={!this.props.active}
          value={this.state.color}
          onChange={(e) => {this.updateColor(e.target.value)}}
        />
    
    );
  }
}
