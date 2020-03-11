import React, { Component } from "react";
import * as THREE from "three";

import ColorPicker from "./color-picker";

import PropTypes from "prop-types";

import EditorUtils from "./editor-utils";
import {EditorPage} from "./editor-page"
import {DisableButton, PresetColorButton, CustomColorButton, TextureButton} from "./buttons"

import { LabeledTexture } from "../labeled-texture";
import Material from "./material"

import hair from "../../includes/textures/hair_default.png";
import eyes from "../../includes/textures/eyes_default.png";
import eyebrows from "../../includes/textures/eyebrows_default.png";

import hair_none from "../../includes/icons/icons_hair_none.png"
import hair_short from "../../includes/icons/icons_hair_messy.png"
import hair_blair from "../../includes/icons/icons_hair_blair.png"
import hair_long from "../../includes/icons/icons_hair_long.png"

const hairColors = ["#aaabbb", "#bbbccc", "#dddeee"];
const eyeColors = ["#aaabbb", "#bbbccc", "#dddeee"];

export default class HeadEditor extends Component {
    static propTypes = {
      model: PropTypes.object
    }

    constructor(props) {
      super(props);

      this.materials = [
        new Material(this.props.model.material.clone(), "hair", [new LabeledTexture(hair)]),
        new Material(this.props.model.material.clone(), "eyebrows", [new LabeledTexture(eyebrows)]),
        new Material(this.props.model.material.clone(), "eyes", [new LabeledTexture(eyes)])
    ]

      this.state = {
        hair:new THREE.Color().randomize().getHexStringFull(),
        eyes:new THREE.Color().randomize().getHexStringFull()
      }
      EditorUtils.setMaterialColor(this.state.hair, this.materials[0]) 
      EditorUtils.setMaterialColor(this.state.hair, this.materials[1]) 
      EditorUtils.setMaterialColor(this.state.eyes, this.materials[2]) 

      this.editorPage = React.createRef();
    }

    render() {
      return (
        <EditorPage ref={this.editorPage}>
            <label>Hair Type</label>
           
            
            <div>
                <TextureButton value="1" defaultChecked={false} name="hair-type" src={hair_none}/>    
                <TextureButton value="2" defaultChecked={true} name="hair-type" src={hair_short}/>    
                <TextureButton value="3" defaultChecked={false} name="hair-type" src={hair_blair}/>
                <TextureButton value="4" defaultChecked={false} name="hair-type" src={hair_long}/>
            </div>
            <label>Hair Color</label>
            <div>
            <ColorPicker
                color={this.state.hair}
                colors={hairColors}
                onChange={(e) => {
                  this.setState({hair:e.rgb}); 
                  EditorUtils.setMaterialColor(e.hex, this.materials[0]) 
                  EditorUtils.setMaterialColor(e.hex, this.materials[1]) 
                }}
              />
            </div>
            <label>Eye Color</label>
            <div>
            <ColorPicker
                color={this.state.eye}
                colors={eyeColors}
                onChange={(e) => {
                  this.setState({eye:e.rgb}); 
                  EditorUtils.setMaterialColor(e.hex, this.materials[2]) 
                }}
              />
            </div>
        </EditorPage>
      );

    }
}