import * as THREE from "three";
import React, { Component } from "react";
import PropTypes from "prop-types";

import { ColorPicker } from "./color-picker";

export class TextureLayer extends Component {
  static propTypes = {
    material: PropTypes.object,
    label: PropTypes.string,
    path: PropTypes.string,
    filenames: PropTypes.arrayOf(PropTypes.string)
  };

  constructor(props) {
    //material, path filenames
    super(props);
    this.props.material.transparent = true;
    this.props.material.needsUpdate = true;
    this.textures = {};
    this.key = null;
    this.colorPicker = React.createRef();
    this.defaultColor = "#ffffff";

    if (this.props.path && this.props.filenames) {
      this.props.filenames.forEach(fname => {
        this.textures[fname] = null;
      });
      this.setTexture(Object.keys(this.textures)[0]);
    }

    if (this.props.label) {
      const clr = new THREE.Color(0, 0, 0).setHex(Math.random() * 0xffffff);
      this.defaultColor = "#" + clr.getHexString();
    }
  }

  setTexture(key) {
    if (!this.props.path || this.key == key) return;

    if (!(key in this.textures)) this.textures[key] = null;

    if (this.textures[key]) {
      this.props.material.map = this.textures[key];
      this.props.material.needsUpdate = true;
    } else {
      const loader = new THREE.TextureLoader();
      loader.load(this.props.path + key + ".png", texture => {
        texture.flipY = false;
        this.props.material.map = texture;
        this.props.material.needsUpdate = true;
      });
    }
    this.key = key;
  }

  getDownloadTexture() {
    const canvas = window.document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;

    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(this.props.material.map.image, 0, 0);
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "#" + this.props.material.color.getHexString();
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.globalCompositeOperation = "destination-atop";
    ctx.drawImage(this.props.material.map.image, 0, 0);

    return canvas;
  }

  randomize() {
    this.colorPicker.current.randomize();
  }

  render() {
    return (
      <ColorPicker
        label={this.props.label}
        material={this.props.material}
        defaultColor={this.defaultColor}
        ref={this.colorPicker}
      />
    );
  }

  //clone base material
  //load list of textures and store in as keyvals based on file names
  //set current tex to first in group

  //function for applying current tint to
}
