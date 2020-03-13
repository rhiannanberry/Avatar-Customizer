import React, { Component } from "react";
import * as THREE from "three";

import ColorPicker from "./color-picker";
import Swatches from "./color-picker2"
import {EditorPage} from "./editor-page"
import EditorUtils from "./editor-utils"

import { LabeledTexture } from "../labeled-texture";
import Material from "./material"

import shirt from "../../includes/textures/shirt_default.png";
import jacket from "../../includes/textures/jacket_default.png";

//import ae from "../../includes/textures/logo_front/ae.png";
import duck from "../../includes/textures/logo_front/duck.png";
//import gt from "../../includes/textures/logo_front/gt.png"; 

import ieee_black from "../../includes/textures/logo_front/ieee_logo_black.png"; 
import ieee_red from "../../includes/textures/logo_front/ieee_logo_red.png"; 
import ieee_white from "../../includes/textures/logo_front/ieee_logo_white.png"; 

import {DisableButton, PresetColorButton, CustomColorButton, TextureButton} from "./buttons"

const shirtColors = ["#f2f2f2", "#cedded", "#92a1b1", "#3479b7","#7d0c1e","#262525"]

export default class ShirtEditor extends Component {
    constructor(props) {
      super(props);

      this.materials = [
        new Material(this.props.model.material.clone(), "shirt", [new LabeledTexture(shirt)]),
        
        new Material(this.props.model.material.clone(), "logoFront", 
        [new LabeledTexture(ieee_white),new LabeledTexture(ieee_red),new LabeledTexture(ieee_black),new LabeledTexture(duck)], false, true, 148,476,
        220,270, true),
        new Material(this.props.model.material.clone(), "jacket", [new LabeledTexture(jacket)]),
        new Material(this.props.model.material.clone(), "logoBack", 
            [new LabeledTexture(ieee_white),new LabeledTexture(ieee_red),new LabeledTexture(ieee_black),new LabeledTexture(duck),], false, true, 662,476,
            220,270, true),
      ]

      this.state = {
        shirt:new THREE.Color().randomize().getHexStringFull(),
        jacket:new THREE.Color().randomize().getHexStringFull(),
      }
      EditorUtils.setMaterialColor(this.state.shirt, this.materials[0]) 
      this.materials[3].setActive(false);
      this.materials[2].setActive(false);
      this.editorPage = React.createRef();
    }

    setLogo(index, src) {
      this.materials[index].setActive(src!=null);
      (src == null) ? null : this.materials[index].setTextureByPath(src) ;
    }

    render() {
      return (
        <EditorPage ref={this.editorPage}>
            <label>Shirt</label>
            <div>
            <Swatches 
              colors={shirtColors} 
              canDisable={false}
              onChange={(color) => {
                  EditorUtils.setMaterialColor(color, this.materials[0]) 
              }}
            />
            </div>
            <label>Jacket</label>
            <div>
              <Swatches 
                colors={shirtColors} 
                canDisable={true}
                selected={'none'}
                onChange={(color) => {
                  if (color == 'none') {
                    this.materials[2].setActive(false);
                  } else {
                    this.materials[2].setActive(true);
                    EditorUtils.setMaterialColor(color, this.materials[2]) 
                  }
                }}
              />
            
            </div>
            <label>Front</label>
            <div>

              <Swatches
                width={'40px'}
                height={'40px'}
                selected={ieee_white}
                textures={[ieee_white,ieee_red,ieee_black, duck]}
                canDisable={true}
                canUpload={true}
                onChange={(src) => {
                  if (src == 'none') {
                    this.setLogo(1, null);
                  } else {
                    this.setLogo(1, src)
                  }
                }}
                onUpload={(file) => {
                  const path = window.URL.createObjectURL(file);
                  this.materials[1].labeledTextures.push(new LabeledTexture(path))
                  console.log(this.materials[1].labeledTextures)
                  this.setLogo(1, path)
                }}
                />
            </div>
            <label>Back</label>
            <div>
              <Swatches
                width={'40px'}
                height={'40px'}
                selected="none"
                textures={[ieee_white,ieee_red,ieee_black, duck]}
                canDisable={true}
                canUpload={true}
                onChange={(src) => {
                  if (src == 'none') {
                    this.setLogo(3, null);
                  } else {
                    this.setLogo(3, src)
                  }
                }}
                onUpload={(file) => {
                  const path = window.URL.createObjectURL(file);
                  this.materials[3].labeledTextures.push(new LabeledTexture(path))
                  console.log(this.materials[3].labeledTextures)
                  this.setLogo(3, path)
                }}
              />

            </div>
        </EditorPage>
      );

    }
}