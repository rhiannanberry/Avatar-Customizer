import React, { Component,  } from "react";
import * as PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";

import { Material } from "../models/materials/material";
import Radio from "./radio";

interface MaterialRadioGroupProps {
    materials: Material[];
    texturePaths: string[];
}

export default class MaterialRadioGroup extends Component {
    props: MaterialRadioGroupProps;
    disabled: Boolean;
    selected: number;//just gonna go with key here

    static propTypes = {
        materials: PropTypes.arrayOf(PropTypes.instanceOf(Material)),
        texturePaths: PropTypes.arrayOf(PropTypes.string)
    }

    constructor(props: MaterialRadioGroupProps) {
        super(props);
        this.disabled = true; //default to disabled. No randomizing
        this.disableAll = this.disableAll.bind(this);
        this.toggleSelected = this.toggleSelected.bind(this);
    }

    disableAll() {
        this.disabled = true;
        this.props.materials.forEach(material => {
            material.material.visible = false;
        })
        this.forceUpdate();
    }

    toggleSelected(selected: number) {
        if (selected == this.selected) {
            this.selected = -1;
            this.disableAll();
        } else {
            this.props.materials[this.selected].material.visible = false;
            this.props.materials[selected].material.visible = true;
            this.selected = selected;
            this.forceUpdate();
        }
    }

    render() {
        const disableButton = (
            <Radio 
                onClickCallback={this.disableAll} 
                selected={this.disabled}>
                    <FontAwesomeIcon className="icon" icon={faBan}/>
            </Radio>
        );
        const textures = this.props.texturePaths.map((path, i) => 
            <Radio 
                key={i}
                value={i}
                onClickCallback={this.toggleSelected}
                selected={!this.disabled && this.selected == i}>
                <img className="icon" src={path}/>
            </Radio>
        )
        return (
            <div className="swatchContainer">
                {disableButton}
                {textures}
            </div>
        )
    }
}