import * as THREE from "three";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ColorPicker } from "./color-picker";
import { TextureDropdown } from "./texture-dropdown";
import {RadioButton, DisableButton, CustomColorButton, PresetColorButton, DownloadButton, UploadButton } from "./buttons";
import { LayerToggle } from "./toggle";
import { LabeledTexture } from "../labeled-texture";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTint } from "@fortawesome/free-solid-svg-icons/faTint";

export class TextureLayer extends Component {
  static propTypes = {
    material: PropTypes.object,
    label: PropTypes.string,
    labeledTextures: PropTypes.arrayOf(PropTypes.object),
    hidden: PropTypes.bool,
    canDisable: PropTypes.bool,
    active: PropTypes.bool,
    layoutTexture: PropTypes.object,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    scaleTexture: PropTypes.bool
  };

  static defaultProps = {
    hidden: false,
    canDisable: false,
    active: true,
    labeledTextures: [],
    x: 0,
    y: 0,
    width: 1024,
    height: 1024,
    scaleTexture: false
  };

  constructor(props) {
    super(props);

    this.props.material.transparent = true;
    this.textures = {};
    this.key = null;
    this.index = 0;
    this.colorPicker = React.createRef();
    this.dropdown = React.createRef();

    this.state = {
      active: props.active
    };

    if (this.props.hidden) return;

    this.props.material.visible = false;

    this.setTexture(0);
  }

  componentDidMount() {
    if (this.props.hidden) return;
    this.randomize();
  }

  setActive(isActive) {
    this.setState({ active: isActive });
    this.props.material.visible = isActive;
    this.props.material.needsUpdate = true;
  }

  setColor(color) {
    this.props.material.color.set(color);
    this.props.material.needsUpdate = true;
  }

  setTexture(index) {
    if (index >= this.props.labeledTextures.length) return;

    this.props.labeledTextures[index]
    .getTexture(
      this.props.x,
      this.props.y,
      this.props.width,
      this.props.height,
      this.props.scaleTexture
    ).then(texture => {
      this.props.material.visible = this.state.active;
      this.props.material.needsUpdate = true;
      this.props.material.map = texture;
      this.index = index;
    });
  }

  fileUploadHandler(file) {
    const label = file.name
      .split(".")
      .slice(0, -1)
      .join(".");
    this.props.labeledTextures.push(new LabeledTexture(window.URL.createObjectURL(file), label));
    const index = this.props.labeledTextures.length - 1;
    this.dropdown.current.addOption(label);
    this.setTexture(index);
  }

  getLayoutTexture() {
    /*const tex = await this.loadTexture("../includes/textures/uv_grid.png");
    const canvas = window.document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(tex.image, 0, 0);
    ctx.globalCompositeOperation = "destination-atop";
    ctx.drawImage(this.props.labeledTextures[0].texture.image, 0, 0);
    return canvas.toDataURL("image/png", 1.0);*/
    return this.props.layoutTexture.texture.image.src;
  }

  getDownloadTexture() {
    const canvas = window.document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;

    if (this.state.active == false) return canvas;

    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(this.props.material.map.image, 0, 0);
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = this.props.material.color.getHexStringFull();
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.globalCompositeOperation = "destination-atop";
    ctx.drawImage(this.props.material.map.image, 0, 0);

    return canvas;
  }

  randomize() {
    if (this.props.hidden == true) return;
    this.colorPicker.current.updateColor(new THREE.Color().randomize().getHexStringFull());
  }

  render() {
    if (this.props.hidden) return null;
    return (
      <tr className="texture-layer">
        <td>
          <LayerToggle
            active={this.props.canDisable}
            checked={this.props.active}
            onToggle={e => this.setActive(e)}
          ></LayerToggle>
        </td>
        <td className="label">{this.props.label}</td>
        <td>
          <ColorPicker active={this.state.active} onChange={this.setColor.bind(this)} ref={this.colorPicker} />
        </td>
        <td>
          <DisableButton name={this.props.label} />
          <CustomColorButton value="1" defaultChecked={true} name={this.props.label} color='#ff22dd'/>
          <PresetColorButton value="2" defaultChecked={false} name={this.props.label} color='#aa9234'/>          
        </td>
        <td>
          <TextureDropdown
            filenames={this.props.labeledTextures.map(t => {
              return t.label;
            })}
            setTexFunc={e => this.setTexture(e)}
            ref={this.dropdown}
            active={this.state.active}
          />
        </td>
      </tr>
    );
  }
}
