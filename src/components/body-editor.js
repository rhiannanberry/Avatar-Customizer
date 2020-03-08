import React, { Component } from "react";
import EditorUtils from "./editor-utils";
import {EditorPage} from "./editor-page"
import Buttons, {DisableButton, PresetColorButton, CustomColorButton} from "./buttons"

import PropTypes from "prop-types";
import { LabeledTexture } from "../labeled-texture";
import Material from "./material"

import skin from "../../includes/textures/skin_default.png";
import blush from "../../includes/textures/blush_default.png";

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
    }

    render() {
      
      return (
        <EditorPage ref={this.editorPage}>
            <label>Body Type</label>
            <div>
                <PresetColorButton value="1" defaultChecked={true} name="body-type" color='#aa9234'/>    
                <PresetColorButton value="2" defaultChecked={false} name="body-type" color='#aa9234'/>
            </div>
            <label>Skin Color</label>
            <div>
                <CustomColorButton 
                  value="0" 
                  defaultChecked={true} 
                  name="body-color"
                  onClick={(e) => {this.materials[0].setActive(true)}}
                  onChange={ (clr) => { EditorUtils.setMaterialColor(clr, this.materials[0]) } }
                />

                { EditorUtils.presetColorButtons(skinColors, "body-color", this.materials[0]) }
                
            </div>
            <label>Blush</label>
            <div>
                <DisableButton value="0" name="blush-color" onChange={(e) => {this.materials[1].setActive(false)}}/>

                <CustomColorButton
                  value="1" 
                  defaultChecked={true} 
                  name="blush-color" 
                  onClick={(e) => {this.materials[1].setActive(true)}}
                  onChange={(clr) => {EditorUtils.setMaterialColor(clr, this.materials[1])}}
                />
                
                { EditorUtils.presetColorButtons(blushColors, "blush-color", this.materials[1]) }
            </div>
        </EditorPage>
      );

    }
}