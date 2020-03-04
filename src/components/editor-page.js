import * as THREE from "three";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ColorPicker } from "./color-picker";
import { TextureDropdown } from "./texture-dropdown";
import {RadioButton, DisableButton, CustomColorButton, PresetColorButton, DownloadButton, UploadButton } from "./buttons";
import "../stylesheets/editor-page.scss"
//can include multiple texture layers
//defines the overarching style of the editor layer
//give a radio button to make toggling between easier
export class EditorPage extends Component{
    constructor(props) {
      super(props);
      this.state = {
        selected: true
      }
    }

    changed(e) {
      this.setState({selected:e.target.checked})
    }

    render() {
      return (
        <div 
          id={this.props.id}
          className="editorPageContainer"
        >
        <input 
          id={this.props.id} 
          onChange={this.changed.bind(this)}
          value={this.props.value} 
          type="radio" 
          name="editorPages"
          className="editorPageButton"
          defaultChecked={this.props.defaultChecked}
        />
        <div
        className="editorPage"
        style={{visibility:this.state.selected}}>
        {this.props.children}
        </div>
        
        </div>
      );
    }
  }