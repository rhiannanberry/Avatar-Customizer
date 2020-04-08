import React, { Component } from "react";
import * as THREE from "three";
import {EditorPage} from "../../editor-page"
import Swatches from "../../color-picker2"

import PropTypes from "prop-types";
import Material from "../../material"

import ColorPicker from "../../color-picker"

import straight from "./icons_straight.png"
import curvy from "./icons_curvy.png"

import skin from "./skin_default.png";
import blush from "./blush_default.png";

const skinColors = ["#503335", "#592f2a", "#a1665e", "#c58c85", "#d1a3a4", "#ecbcb4", "#FFE2DC"];
const blushColors = ["#551F25", "#82333C", "#983E38", "#DC6961","#e3b9a1"];

var assets = {
  body: {
    selected: Math.floor(Math.random() * Math.floor(2)) == 0 ? straight : curvy,
    models: [straight, curvy],
    materials: []
  },
  skin: {
    selected: skinColors[Math.floor(Math.random() * Math.floor(skinColors.length))],
    colors: skinColors,
    materials: []
  },
  blush: {
    selected: blushColors[Math.floor(Math.random() * Math.floor(blushColors.length))],
    colors: blushColors,
    materials: []
  }
}

export default class BodyEditor extends Component{
    static propTypes = {
      model: PropTypes.object,
      modelPart: PropTypes.object,
      onChange: PropTypes.func
    }

    constructor(props) {
      super(props);

      assets.skin.materials = [new Material(this.props.model.material.clone(), "skin", [skin])];
      assets.blush.materials = [new Material(this.props.model.material.clone(), "blush", [blush])];

      this.materials = [ ...assets.skin.materials, ...assets.blush.materials]
      
      this.editorPage = React.createRef();

      assets.body.selected = this.props.selected == "straight" ? straight : curvy;

      assets.skin.materials[0].setColor(assets.skin.selected);
      assets.blush.materials[0].setColor(assets.blush.selected);

      this.state = {color: assets.skin.selected}

    }

    render() {
      return (
        <EditorPage ref={this.editorPage}>
            <label>Body</label>
            <div>
            <Swatches
                selected={assets.body.selected}
                width={'70px'}
                height={'80px'}
                textures={assets.body.models}
                canDisable={false}
                onChange={(src) => {
                  this.props.onChange((src == straight) ? 'straight' : 'curvy')
                  this.props.modelPart.setSelected((src == curvy) ? 1 : 2)
                }}
              />
            </div>
            <label>Skin</label>
            <div>
               <Swatches 
                  colors={assets.skin.colors} 
                  canDisable={false}
                  material={assets.skin.materials}
                  selected={assets.skin.selected}
                  />
            </div>
            <label>Blush</label>
            <div>
              <Swatches 
                  colors={assets.blush.colors} 
                  canDisable={true}
                  material={assets.blush.materials}
                  selected={assets.blush.selected}
                  
                />
            </div>
        </EditorPage>
      );

    }
}