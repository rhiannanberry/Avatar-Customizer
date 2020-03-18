import React, { Component } from "react";

import Buttons, {DisableButton, PresetColorButton, CustomColorButton} from "../buttons"


export default class EditorUtils {

    static setMaterialColor(clr, material) {
        material.setActive(true);
        material.setColor(clr)
      }

      static customColorButton(name, material, value) {
        return (
            <CustomColorButton 
                value={value}
                defaultChecked={true}
                name={name}
                onClick={(e) => {material.setActive(true)}}
                onChange={(e) => {this.setMaterialColor(e, material)}}
            />
        )
      }

      static presetColorButtons(colorList, name, material) {
        return (
            colorList.map((value, i) => {
                return (
                    <PresetColorButton
                        key={i}
                        value={i}
                        defaultChecked={false}
                        name={name}
                        color={value}
                        onChange={(e) => {
                            if (Array.isArray(material)) {
                                material.map((mat) => {
                                    this.setMaterialColor(value,mat);
                                })
                            } else {
                                this.setMaterialColor(value, material)
                            }
                        }}
                    />
                );
            })
        )
      }
}