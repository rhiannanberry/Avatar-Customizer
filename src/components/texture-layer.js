import * as THREE from "three";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ColorPicker } from "./color-picker";
import { TextureDropdown } from "./texture-dropdown";
import { DownloadButton, UploadButton } from "./buttons"
import { LayerToggle } from "./toggle"
import { until } from "../util"

export class TextureLayer extends Component {
  static propTypes = {
    material: PropTypes.object,
    label: PropTypes.string,
    path: PropTypes.string,
    filenames: PropTypes.arrayOf(PropTypes.string),
    layout: PropTypes.string,
    hidden: PropTypes.bool,
    canDisable: PropTypes.bool,
    active: PropTypes.bool
  };

  static defaultProps = {
    hidden: false,
    canDisable: false,
    active: true
  };

  constructor(props) {
    //material, path filenames
    super(props);

    
    this.props.material.transparent = true;
    this.textures = {};
    this.key = null;
    this.colorPicker = React.createRef();
    this.dropdown = React.createRef();
    
    
    this.state = {
      active: props.active
    };

    if (this.props.hidden) return;

    this.props.material.visible = false;
    
    if (this.props.path && this.props.filenames) {
      this.props.filenames.forEach(fname => {

        this.textures[fname] = {
          path: this.props.path + fname + '.png',
          texture: null
        };
      });
      this.setTexture(this.props.filenames[0]);
    }
  }
  
  componentDidMount() {
    if (this.props.hidden) return;
    this.randomize();
  }

  setActive(isActive) {
    this.setState({active: isActive});
    this.props.material.visible = isActive;
    this.props.material.needsUpdate = true;
  }

  setColor(color) {
    this.props.material.color.set(color);
    this.props.material.needsUpdate = true;
  }

  setTexture(key) {
    if (this.state.active == false || !(key in this.textures)) return;

    if (this.textures[key].texture) {
      this.props.material.map = this.textures[key].texture;
      this.props.material.visible = true;
      this.props.material.needsUpdate = true;

    } else {
      const loader = new THREE.TextureLoader();
      loader.load(this.textures[key].path, texture => {
        this.props.material.visible = true;
        texture.flipY = false;
        this.props.material.map = texture;
        this.props.material.needsUpdate = true;
        this.textures[key].texture = texture;
      }, undefined, (e)=> {console.log(e)});
    }
    this.key = key;
  }

  loadTexture(src) {
    return new Promise((resolve,reject) => {
      new THREE.TextureLoader().load(src, resolve, undefined, reject);
    });
  }

  fileUploadHandler(file) {
    
    const key = file.name.split('.').slice(0, -1).join('.')
    if (key == "default") return;
    this.textures[key] = {
      path: window.URL.createObjectURL(file),
      texture: null
    }
    this.dropdown.current.addOption(key);
    this.setTexture(key);
  }

  async getLayoutTexture() {
    const tex = await this.loadTexture("../includes/textures/uv_grid.png");
    const canvas = window.document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(tex.image, 0, 0);
    ctx.globalCompositeOperation = "destination-atop";
    ctx.drawImage(this.textures['default'].texture.image, 0, 0);
    return canvas.toDataURL("image/png", 1.0);
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
    ctx.fillStyle = "#" + this.props.material.color.getHexString();
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.globalCompositeOperation = "destination-atop";
    ctx.drawImage(this.props.material.map.image, 0, 0);

    return canvas;
  }

  randomize() {
    if (this.props.hidden == true || this.state.active == false) return;
    this.colorPicker.current.updateColor( new THREE.Color().randomize().getHexStringFull() );
  }

  render() {
    if (this.props.hidden) return null;
    return (
      <div className="texture-layer">
        <LayerToggle active={this.props.canDisable} checked={this.props.active} onToggle={(e)=> this.setActive(e)}></LayerToggle>
        <div className="label">
          {this.props.label}
        </div>
        <ColorPicker
          active={this.state.active}
          onChange={this.setColor.bind(this)}
          ref={this.colorPicker}
          />
        <div className="layer-button-group">
          <DownloadButton name={this.props.label + "_layout"} onClick={()=>this.getLayoutTexture()}></DownloadButton>
          <UploadButton onUpload={this.fileUploadHandler.bind(this)}></UploadButton>
        </div>
        
        <TextureDropdown
            filenames={Object.keys(this.textures)}
            setTexFunc={e => this.setTexture(e)}
            ref={this.dropdown}
            active={this.state.active}
          />
        
      </div>
    );

    //https://blog.benestudio.co/custom-file-upload-button-with-pure-css-5aacf39aa0a ^^ setting up upload button
  }

  //clone base material
  //load list of textures and store in as keyvals based on file names
  //set current tex to first in group

  //function for applying current tint to
}
