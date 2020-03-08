import React, { Component } from "react";
import {EditorPage} from "./editor-page"
import EditorUtils from "./editor-utils"

import { LabeledTexture } from "../labeled-texture";
import Material from "./material"

import shirt from "../../includes/textures/shirt_default.png";

import {DisableButton, PresetColorButton, CustomColorButton} from "./buttons"

const shirtColors = ["#abcdeff", "#abab12", "#123abc"]

export default class ShirtEditor extends Component {
    constructor(props) {
      super(props);

      this.materials = [
        new Material(this.props.model.material.clone(), "shirt", [new LabeledTexture(shirt)])
      ]

      this.editorPage = React.createRef();
    }

    render() {
      return (
        <EditorPage ref={this.editorPage}>
            <label>Shirt Color</label>
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
                <PresetColorButton value="2" defaultChecked={true} name="shirt-logo-front" color='#aa9234'/>
                <PresetColorButton value="3" defaultChecked={false} name="shirt-logo-front" color='#aa9234'/>
                <PresetColorButton value="4" defaultChecked={false} name="shirt-logo-front" color='#aa9234'/>
            </div>
            <label>Logo Back</label>
            <div>
                <DisableButton value="1" name="shirt-logo-back" />
                <PresetColorButton value="2" defaultChecked={true} name="shirt-logo-back" color='#aa9234'/>
                <PresetColorButton value="3" defaultChecked={false} name="shirt-logo-back" color='#aa9234'/>
                <PresetColorButton value="4" defaultChecked={false} name="shirt-logo-back" color='#aa9234'/>
            </div>
        </EditorPage>
      );

    }
}