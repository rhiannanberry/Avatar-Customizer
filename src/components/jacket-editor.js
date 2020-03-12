import React, { Component } from "react";
import * as THREE from "three";

import ColorPicker from "./color-picker";
import {DisableButton, PresetColorButton, CustomColorButton, TextureButton} from "./buttons"

import {EditorPage} from "./editor-page"
import EditorUtils from "./editor-utils"

import { LabeledTexture } from "../labeled-texture";
import Material from "./material"

import jacket from "../../includes/textures/jacket_default.png"

import ae from "../../includes/textures/logo_front/ae.png";
import duck from "../../includes/textures/logo_front/duck.png";
import gt from "../../includes/textures/logo_front/gt.png";

const jacketColors = ["#7d0c1e", "#cedded", "#92a1b1", "#3479b7"];

export default class JacketEditor extends Component {
    constructor(props) {
      super(props);

      this.materials = [
        new Material(this.props.model.material.clone(), "jacket", [new LabeledTexture(jacket)]),
        new Material(this.props.model.material.clone(), "jacketLogoBack", 
            [new LabeledTexture(duck),new LabeledTexture(ae),new LabeledTexture(gt)], false, true, 662,476,
            220,270, true)
      ]

      this.state = {
        jacketColor: new THREE.Color().randomize().getHexStringFull()
      }

      this.editorPage = React.createRef();
    }

    setLogo(index, src) {
      this.materials[index].setActive(src!=null);
      (src == null) ? null : this.materials[index].setTextureByPath(src) ;
    }

    render() {
      return (
        <EditorPage ref={this.editorPage}>
            <label>Jacket Color</label>
            <div>
                <DisableButton defaultChecked={true} value="1" name="jacket-color" />
                <ColorPicker
                color={this.state.jacketColor}
                colors={jacketColors}
                onChange={(e) => {
                  this.setState({jacketColor:e.rgb}); 
                  EditorUtils.setMaterialColor(e.hex, this.materials[0]) 
                }}
              />
            </div>
            <label>Back</label>
            <div>
                <DisableButton value="1" name="jacket-logo" />
                <PresetColorButton value="2" defaultChecked={true} name="jacket-logo" color='#aa9234'/>
                <PresetColorButton value="3" defaultChecked={false} name="jacket-logo" color='#aa9234'/>
                <PresetColorButton value="4" defaultChecked={false} name="jacket-logo" color='#aa9234'/>
            </div>
        </EditorPage>
      );

    }
}