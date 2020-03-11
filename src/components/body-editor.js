import React, { Component } from "react";
import * as THREE from "three";
import EditorUtils from "./editor-utils";
import {EditorPage} from "./editor-page"
import Buttons, {TextureButton} from "./buttons"

import PropTypes from "prop-types";
import { LabeledTexture } from "../labeled-texture";
import Material from "./material"

import ColorPicker from "./color-picker"

import straight from "../../includes/icons/icons_straight.png"
import curvy from "../../includes/icons/icons_curvy.png"

import skin from "../../includes/textures/skin_default.png";
import blush from "../../includes/textures/blush_default.png";
import logo from "../../includes/textures/logo_front/ae.png"

const skinColors = ["#eeffee", "#eeccff", "#bbbbbb"];
const blushColors = ["#aabbcc", "#abcdef", "#000fff"];

export default class BodyEditor extends Component{
    static propTypes = {
      model: PropTypes.object
    }

    constructor(props) {
      super(props);
      
      this.materials = [
          new Material(this.props.model.material.clone(), "skin", [new LabeledTexture(skin)]),
          new Material(this.props.model.material.clone(), "blush", [new LabeledTexture(blush)])
      ]
      this.editorPage = React.createRef();
      this.state = {
          skin:new THREE.Color().randomize().getHexStringFull(),
          blush:new THREE.Color().randomize().getHexStringFull()
      }
      EditorUtils.setMaterialColor(this.state.skin, this.materials[0]) 
      EditorUtils.setMaterialColor(this.state.blush, this.materials[1]) 

    }

    render() {      
      return (
        <EditorPage ref={this.editorPage}>
            <label>Body Type</label>
            <div>
                <TextureButton value="1" defaultChecked={true} name="body-type" src={straight} />
                <TextureButton value="2" defaultChecked={false} name="body-type" src={curvy} />
            </div>
            <label>Skin Color</label>
            <div>
              <ColorPicker
                color={this.state.skin}
                colors={skinColors}
                onChange={(e) => {
                  this.setState({skin:e.rgb}); 
                  EditorUtils.setMaterialColor(e.hex, this.materials[0]) 
                }}
              />
               
            </div>
            <label>Blush</label>
            <div>
            <ColorPicker
                color={this.state.blush}
                colors={blushColors}
                onChange={(e) => {
                  this.setState({blush:e.rgb}); 
                  EditorUtils.setMaterialColor(e.hex, this.materials[1]) 
                }}
              />
            </div>
        </EditorPage>
      );

    }
}