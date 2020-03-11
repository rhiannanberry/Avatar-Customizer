import * as THREE from "three";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";
import { faTint } from "@fortawesome/free-solid-svg-icons/faTint";
import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";
import "../stylesheets/buttons.scss"

export class DownloadButton extends Component {
  static propTypes = {
    name: PropTypes.string,
    onClick: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.link = React.createRef();
  }

  async clickHandler() {
    const src = await this.props.onClick();
    this.link.current.download = this.props.name + ".png";
    this.link.current.href = src;
    this.link.current.click();
  }

  render() {
    return (
      <>
        <div className="layer-button" title="Download layout PNG to customize" onClick={() => this.clickHandler()}>
          <FontAwesomeIcon icon={faDownload} />
          <a ref={this.link} download hidden onClick={e => e.stopPropagation()}>
            {" "}
          </a>
        </div>
      </>
    );
  }
}

export class UploadButton extends Component {
  static propTypes = {
    onUpload: PropTypes.func
  };
  static defaultProps = {
    onUpload: () => {}
  };
  constructor(props) {
    super(props);
    this.input = document.createElement("input");
    this.input.type = "file";
    this.input.hidden = true;
    this.file = React.createRef();
  }

  changeHandler(e) {
    this.props.onUpload(e.target.files[0]);
  }

  render() {
    return (
      <div className="layer-button" title="Upload custom layer texture" onClick={() => this.file.current.click()}>
        <input type="file" ref={this.file} hidden accept="image/png" onChange={this.changeHandler.bind(this)} />
        <FontAwesomeIcon icon={faUpload} />
      </div>
    );
  }
}

export class RadioButton extends Component {
  static propTypes = {
    defaultChecked: PropTypes.bool,
    name: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    classNames: PropTypes.string
  };

  static defaultProps = {
    onChange: () => {},
    onClick: () => {}
  }

  constructor(props) {
    super(props);
    this.checked = this.props.defaultChecked;
    this.state = {
      value: this.props.defaultChecked ? this.props.value : ''
    }
  }
  changed(e) {
    this.setState({value: e.target.checked});
    if (this.props.onChange) this.props.onChange(e);
  }
  clicked(e) {
    if (this.props.onClick) this.props.onClick(e);

  }
  render() {
    return (
      <label className={"radioButton" + (this.props.classNames ? " " + this.props.classNames : "")}>
        <span className="buttonShape background"></span>
      <input 
        id={this.props.id} 
        onClick={this.clicked.bind(this)}
        onChange={this.changed.bind(this)}
        value={this.props.value} 
        type="radio" 
        name={this.props.name}
        defaultChecked={this.props.defaultChecked}
      />
      {this.props.children}
      <span className="checkmark buttonShape"></span>
      
      </label>
    );
  }
}

export class CustomColorButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      color: this.props.color
    }

    this.color = this.props.color;
    this.colorPicker = React.createRef();

    
    if (this.props.defaultChecked && typeof this.props.onChange == "function") this.props.onChange(this.color);
  }
  
  componentDidMount() {
    
    this.randomize();
  }

  clicked(e) {
    this.colorPicker.current.click();
    if (this.props.onClick) this.props.onClick(e.target.value);
    if (this.props.onChange) this.props.onChange(this.color);
  }

  changed(e) {
    this.setState({color:e.target.value});
    this.color = e.target.value;
    if (this.props.onChange) this.props.onChange(e.target.value);
  }

  randomize() {
    const newColor = new THREE.Color().randomize().getHexStringFull();
    this.setState({color: newColor})
    if (typeof this.props.onChange == "function" ) this.props.onChange(newColor);
  }

  render() {
    
    return (
      <RadioButton
      id={this.props.id}
      onClick={this.clicked.bind(this)}
      value={this.props.value}
      name={this.props.name}
      defaultChecked={this.props.defaultChecked}
    >
      <input
        ref={this.colorPicker}
        type="color"
        onChange={(e) => {this.changed(e)}}
        value={this.color}
      />
      <FontAwesomeIcon className="icon" icon={faTint} style={{color:this.color}}/>
    </RadioButton>
    );
  }
}

export class TextureButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <RadioButton
        id={this.props.id}
        onChange= { (e) => {if (typeof props.onChange == "function") props.onChange(e)} }
        value={this.props.value}
        defaultChecked={this.props.defaultChecked}
        name={this.props.name}
        classNames="textureButton"
      >
        <div
          className="imageContainer"
        >
          <img src={this.props.src}/>
        </div>
      </RadioButton>
    );
  }
}

export const PresetColorButton = (props) => {
  return (
    <RadioButton
      id={props.id}
      onChange={(e) => {
        e.target.color = props.color;
        if (typeof props.onChange == "function") props.onChange(e)}
      }
      value={props.value}
      defaultChecked={props.defaultChecked}
      name={props.name}
    >
      <span className="colorfield" style={{backgroundColor:props.color}}/>
    </RadioButton>
  );
}

export const DisableButton = (props) => {
  return (
    <RadioButton
      id={props.id}
      onChange={props.onChange}
      value={props.value}
      defaultChecked={props.defaultChecked}
      name={props.name}
    >
      <FontAwesomeIcon className="icon" icon={faBan}/>
    </RadioButton>
  );
}

export default class Buttons {
  static presetColorButtons(colorList, index, name, onChange, context) {
    return (
      colorList.map((value, i) => {
      return (
          <PresetColorButton
            key={i}
            value={i} 
            defaultChecked={false} 
            name={name}
            color={value}
            onChange={(e) => {onChange(index, value, context)}}
            />
          );
      })
    )
}
}

