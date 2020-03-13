import React, { Component } from "react";
import * as THREE from "three";
import EditorUtils from "./editor-utils";
import {EditorPage} from "./editor-page"
import Buttons, {TextureButton} from "./buttons"
import Swatches from "./color-picker2"

import PropTypes from "prop-types";
import { LabeledTexture } from "../labeled-texture";
import Material from "./material"

import ColorPicker from "./color-picker"

import straight from "../../includes/icons/icons_straight.png"
import curvy from "../../includes/icons/icons_curvy.png"

import skin from "../../includes/textures/skin_default.png";
import blush from "../../includes/textures/blush_default.png";

const skinColors = ["#503335", "#592f2a", "#a1665e", "#c58c85", "#d1a3a4", "#ecbcb4", "#FFE2DC"];
const blushColors = ["#551F25", "#82333C", "#983E38", "#DC6961","#e3b9a1"];

export default class BodyEditor extends Component{
    static propTypes = {
      model: PropTypes.object,
      onChange: PropTypes.func
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
            <label>Body</label>
            
            <div>
            <Swatches
                selected={straight}
                width={'70px'}
                height={'80px'}
                textures={[straight,curvy]}
                canDisable={false}
                onChange={(src) => {
                  this.props.onChange((src == straight) ? 'straight' : 'curvy')
                  
                }}
              />
            </div>
            <label>Skin</label>
            <div>
               <Swatches 
                  colors={skinColors} 
                  canDisable={false}
                  onChange={(color) => {
                    EditorUtils.setMaterialColor(color, this.materials[0]) 
                  }}
                />
            </div>
            <label>Cheeks</label>
            <div>
              <Swatches 
                  colors={blushColors} 
                  canDisable={true}
                  onChange={(color) => {
                    if (color == 'none') {
                      this.materials[1].setActive(false);
                    } else {
                      this.materials[1].setActive(true);
                      EditorUtils.setMaterialColor(color, this.materials[1]) 
                    }
                  }}
                />
            </div>
        </EditorPage>
      );

    }
}