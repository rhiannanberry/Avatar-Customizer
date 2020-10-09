import React, { Component } from "react";
import * as THREE from "three";

import ColorPicker from "../../color-picker";
import Swatches from "../../color-picker2"

import PropTypes from "prop-types";

import EditorUtils from "../editor-utils";
import {EditorPage} from "../../editor-page"

import Material from "../../material"

import hair from "./hair_default.png";
import eyes from "./eyes_default.png";
import eyebrows from "./eyebrows_default.png";

import hair_none from "./icons_hair_none.png"
import hair_short from "./icons_hair_messy.png"
import hair_blair from "./icons_hair_blair.png"
import hair_long from "./icons_hair_long.png"

const hairTypes = [hair_none, hair_short, hair_blair, hair_long]
const hairColors = ["#2F2321", "#5C4033", "#C04532", "#B9775A", "#E6C690", "#FCE3B8", "#E6E6E6"];
const eyeColors = ["#552919", "#915139", "#917839", "#718233", "#338251", "#335A82"];

var assets = {
  hairModel: {
    selected: hairTypes[Math.floor(Math.random() * Math.floor(hairTypes.length))],
    textures: hairTypes,
    textureNames: ["none", "short", "blair", "long"],
    materials: []
  },
  hair: {
    selected: hairColors[Math.floor(Math.random() * Math.floor(hairColors.length))],
    colors: hairColors,
    materials: []
  },
  eyes: {
    selected: eyeColors[Math.floor(Math.random() * Math.floor(eyeColors.length))],
    colors: eyeColors,
    materials: []
  }
}

export default class HeadEditor extends Component {
    static propTypes = {
      modelPart: PropTypes.object,
      onChange: PropTypes.func
    }

    constructor(props) {
      super(props);      
      assets.hair.materials = [new Material(this.props.modelPart.getMaterial().clone(), "hair", [hair]),
                                new Material(this.props.modelPart.getMaterial().clone(), "eyebrows", [eyebrows])];
      assets.eyes.materials = [new Material(this.props.modelPart.getMaterial().clone(), "eyes", [eyes])];

      this.materials = [
        ...assets.hair.materials,
        ...assets.eyes.materials
    ]

    assets.hairModel.selected = assets.hairModel.textures[assets.hairModel.textureNames.findIndex((e) => {return e == this.props.selected})]
    
      assets.hair.materials[0].setColor(assets.hair.selected);
      assets.hair.materials[1].setColor(assets.hair.selected);
      assets.eyes.materials[0].setColor(assets.eyes.selected);

      this.editorPage = React.createRef();
    }

    onChangeHandler(e) {
      this.props.onChange(e.target.value);
    }

    render() {
      return (
        <EditorPage ref={this.editorPage}>
            <label>Hair Type</label>
           
            
            <div>
            <Swatches
                selected={assets.hairModel.selected}
                width={'80px'}
                height={'80px'}
                textures={assets.hairModel.textures}
                canDisable={false}
                onChange={(src) => {
                  const ind = assets.hairModel.textures.findIndex((e) => {return e == src});
                  console.log(assets.hairModel.textureNames[ind])
                  this.props.modelPart.setSelectedByString(assets.hairModel.textureNames[ind])
                  //this.props.onChange(assets.hairModel.textureNames[ind]);
                                  
                }}
              />
                
            </div>
            <label>Hair Color</label>
            <div>
            <Swatches
                selected={assets.hair.selected}
                colors={hairColors}
                material={assets.hair.materials}
              />
            </div>
            <label>Eye Color</label>
            <div>
            <Swatches
                selected={assets.eyes.selected}
                colors={assets.eyes.colors}
                material={assets.eyes.materials}
              />
            </div>
        </EditorPage>
      );

    }
}