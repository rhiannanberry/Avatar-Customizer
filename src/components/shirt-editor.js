import React, { Component } from "react";
import * as THREE from "three";

import ColorPicker from "./color-picker";
import {EditorPage} from "./editor-page"
import EditorUtils from "./editor-utils"

import { LabeledTexture } from "../labeled-texture";
import Material from "./material"

import shirt from "../../includes/textures/shirt_default.png";

import ae from "../../includes/textures/logo_front/ae.png";
import duck from "../../includes/textures/logo_front/duck.png";
import gt from "../../includes/textures/logo_front/gt.png";

import {DisableButton, PresetColorButton, CustomColorButton, TextureButton} from "./buttons"

const shirtColors = ["#7d0c1e", "#cedded", "#92a1b1", "#3479b7"]

export default class ShirtEditor extends Component {
    constructor(props) {
      super(props);

      this.materials = [
        new Material(this.props.model.material.clone(), "shirt", [new LabeledTexture(shirt)]),
        new Material(this.props.model.material.clone(), "shirtfrontlogo", 
            [new LabeledTexture(duck),new LabeledTexture(ae),new LabeledTexture(gt)], false, true, 148,476,
            220,270, true)
      ]

      this.state = {
        shirt:new THREE.Color().randomize().getHexStringFull(),
      }
      EditorUtils.setMaterialColor(this.state.shirt, this.materials[0]) 

      this.editorPage = React.createRef();
      //this.setLogo();
    }

    setLogo() {
      this.materials[0].setTexture(0);
    }

    render() {
      return (
        <EditorPage ref={this.editorPage}>
            <label>Shirt Color</label>
            <div>
            <ColorPicker
                color={this.state.shirt}
                colors={shirtColors}
                onChange={(e) => {
                  this.setState({hair:e.rgb}); 
                  EditorUtils.setMaterialColor(e.hex, this.materials[0]) 
                }}
              />
            </div>
            <label>Front</label>
            <div>
                <DisableButton value="1" name="shirt-logo-front" />
                <TextureButton value="2" defaultChecked={true} name="shirt-logo-front" src={duck}/>
                <TextureButton value="3" defaultChecked={false} name="shirt-logo-front" src={ae}/>
                <TextureButton value="4" defaultChecked={false} name="shirt-logo-front" src={gt}/>
            </div>
            <label>Back</label>
            <div>
                <DisableButton value="1" name="shirt-logo-back" />
                <TextureButton value="2" defaultChecked={true} name="shirt-logo-back" src={duck}/>
                <TextureButton value="3" defaultChecked={false} name="shirt-logo-back" src={ae}/>
                <TextureButton value="4" defaultChecked={false} name="shirt-logo-back" src={gt}/>
            </div>
        </EditorPage>
      );

    }
}