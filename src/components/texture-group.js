import * as THREE from "three";
import React, { Component } from "react";
import PropTypes from "prop-types";

export class TextureGroup extends Component {
  static propTypes = {
    id: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element),
    model: PropTypes.object
  };

  constructor(props) {
    super(props);

    const len = this.props.children.length;

    this.props.model.geometry.clearGroups();
    this.props.model.material = [];

    for (let i = 0; i < len; i++) {
      this.props.model.geometry.addGroup(0, Infinity, i);
      this.props.model.material.push(this.props.children[i].props.material);
    }
  }

  getDownloadTexture() {
    const canvas = window.document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;

    const ctx = canvas.getContext("2d");
    this.childReferences.forEach(layer => {
      ctx.drawImage(layer.getDownloadTexture(), 0, 0);
    });

    const loader = new THREE.ImageLoader();
    loader.load(canvas.toDataURL("image/png", 1.0), img => {
      const el = document.createElement("a");
      el.href = img.src;
      el.download = "tex.png";
      el.click();
      el.remove();
    });
  }

  randomize() {
    this.childReferences.forEach(layer => {
      layer.randomize();
    });
  }

  render() {
    this.children = React.Children.map(this.props.children, child => {
      this.childReferences = [];
      return React.cloneElement(child, { ref: el => this.childReferences.push(el) });
    });
    return (
      <>
        <table>{this.children}</table>
        <button onClick={e => this.randomize(e)}>Randomize</button>
        <button onClick={e => this.getDownloadTexture(e)}>Download Texture</button>
      </>
    );
  }
}
