import React, { Component } from "react";
import PropTypes from "prop-types";

import EditorUtils from "./editor-utils";
import {EditorPage} from "./editor-page"
import {DisableButton, PresetColorButton, CustomColorButton, TextureButton} from "./buttons"

import { LabeledTexture } from "../labeled-texture";
import Material from "./material"

import hair from "../../includes/textures/hair_default.png";
import eyes from "../../includes/textures/eyes_default.png";
import eyebrows from "../../includes/textures/eyebrows_default.png";

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
      this.editorPage = React.createRef();
    }

    render() {
      return (
        <EditorPage ref={this.editorPage}>
            <label>Hair Type</label>
            <div>
                <DisableButton value="1" name="hair-type" />
                <TextureButton value="2" defaultChecked={true} name="hair-type" src={hair}/>    
                <TextureButton value="3" defaultChecked={false} name="hair-type" src={eyes}/>
                <TextureButton value="4" defaultChecked={false} name="hair-type" src={eyebrows}/>
            </div>
            <label>Hair Color</label>
            <div>
                <CustomColorButton 
                  value="1" 
                  defaultChecked={true} 
                  name="hair-color" 
                  onClick={(e) => {
                    this.materials[0].setActive(true);
                    this.materials[1].setActive(true);
                  }}
                  onChange={(clr) => {
                    EditorUtils.setMaterialColor(clr, this.materials[0]);
                    EditorUtils.setMaterialColor(clr, this.materials[1]);
                  }}
                />
                { EditorUtils.presetColorButtons(hairColors, "hair-color", [this.materials[0], this.materials[1]]) }
                
            </div>
            <label>Eye Color</label>
            <div>
                <CustomColorButton 
                  value="1" 
                  defaultChecked={true} 
                  name="eye-color" 
                  onClick={(e) => {
                    this.materials[2].setActive(true);
                  }}
                  onChange={(clr) => {
                    EditorUtils.setMaterialColor(clr, this.materials[2]);
                  }}
                />
                { EditorUtils.presetColorButtons(eyeColors, "eye-color", this.materials[2]) }
            </div>
        </EditorPage>
      );

    }
}