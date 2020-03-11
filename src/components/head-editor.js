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

const hairColors = ["#2F2321", "#5C4033", "#C04532", "#B9775A", "#E6C690", "#FCE3B8", "#E6E6E6"];
const eyeColors = ["#552919", "#915139", "#917839", "#718233", "#338251", "#335A82"];

export default class HeadEditor extends Component {
    static propTypes = {
      model: PropTypes.object,
      onChange: PropTypes.func
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

    onChangeHandler(e) {
      this.props.onChange(e.target.value);
    }

    render() {
      return (
        <EditorPage ref={this.editorPage}>
            <label>Hair Type</label>
           
            
            <div>
                <TextureButton value="none" defaultChecked={false} name="hair-type" src={hair_none}   onChange={(e) => this.onChangeHandler(e)}/>    
                <TextureButton value="short" defaultChecked={true} name="hair-type" src={hair_short}  onChange={(e) => this.onChangeHandler(e)}/>    
                <TextureButton value="blair" defaultChecked={false} name="hair-type" src={hair_blair} onChange={(e) => this.onChangeHandler(e)}/>
                <TextureButton value="long" defaultChecked={false} name="hair-type" src={hair_long}   onChange={(e) => this.onChangeHandler(e)}/>
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