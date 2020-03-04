import React, { Component } from "react";
import {EditorPage} from "./editor-page"
import {DisableButton, PresetColorButton, CustomColorButton} from "./buttons"

import PropTypes from "prop-types";
import { LabeledTexture } from "../labeled-texture";
import Material from "./material"

import skin from "../../includes/textures/skin_default.png";
import blush from "../../includes/textures/blush_default.png";

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

    setActive(isActive) {
      this.editorPage.current.setActive(isActive);
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
                <CustomColorButton value="1" defaultChecked={true} name="body-color" color='#ff22dd'/>
                <PresetColorButton value="2" defaultChecked={false} name="body-color" color='#aa9234'/>
                <PresetColorButton value="3" defaultChecked={false} name="body-color" color='#aa9234'/>
                <PresetColorButton value="4" defaultChecked={false} name="body-color" color='#aa9234'/>
            </div>
            <label>Blush</label>
            <div>
                <DisableButton name="blush-color" />
                <CustomColorButton value="1" defaultChecked={true} name="blush-color" color='#ff22dd'/>
                <PresetColorButton value="2" defaultChecked={false} name="blush-color" color='#aa9234'/>
                <PresetColorButton value="3" defaultChecked={false} name="blush-color" color='#aa9234'/>
                <PresetColorButton value="4" defaultChecked={false} name="blush-color" color='#aa9234'/>
            </div>
        </EditorPage>
      );

    }
}