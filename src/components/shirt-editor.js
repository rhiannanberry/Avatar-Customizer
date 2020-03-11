import React, { Component } from "react";
import {TwitterPicker} from "react-color";
import {EditorPage} from "./editor-page"
import EditorUtils from "./editor-utils"

import { LabeledTexture } from "../labeled-texture";
import Material from "./material"

import shirt from "../../includes/textures/shirt_default.png";

import ae from "../../includes/textures/logo_front/ae.png";
import duck from "../../includes/textures/logo_front/duck.png";
import gt from "../../includes/textures/logo_front/gt.png";

import {DisableButton, PresetColorButton, CustomColorButton, TextureButton} from "./buttons"

const shirtColors = ["#abcdef", "#abab12", "#123abc"]

export default class ShirtEditor extends Component {
    constructor(props) {
      super(props);

      this.materials = [
        new Material(this.props.model.material.clone(), "shirt", [new LabeledTexture(shirt)]),
        new Material(this.props.model.material.clone(), "shirtfrontlogo", [new LabeledTexture(duck),new LabeledTexture(ae),new LabeledTexture(gt)])
      ]

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
            <TwitterPicker triangle="hide"
            onChangeComplete={ (clr) => {console.log(clr);EditorUtils.setMaterialColor(clr.hex, this.materials[0])} }/>
            <div>
                <CustomColorButton 
                  value="1" 
                  defaultChecked={true} 
                  name="shirt-color"
                  onClick={(e) => {this.materials[0].setActive(true)}}
                  onChange={(clr) => {EditorUtils.setMaterialColor(clr, this.materials[0])}} 
                />
                { EditorUtils.presetColorButtons(shirtColors, "shirt-color", this.materials[0])}

            </div>
            <label>Logo Front</label>
            <div>
                <DisableButton value="1" name="shirt-logo-front" />
                <TextureButton value="2" defaultChecked={true} name="shirt-logo-front" src={duck}/>
                <TextureButton value="3" defaultChecked={false} name="shirt-logo-front" src={ae}/>
                <TextureButton value="4" defaultChecked={false} name="shirt-logo-front" src={gt}/>
            </div>
            <label>Logo Back</label>
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