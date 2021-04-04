import React, { Component,  } from "react";
import * as PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";

import { Material } from "../models/materials/material";
import Texture from "../models/materials/texture";
import Radio from "./radio";

interface MaterialRadioGroupProps {
    material: Material;
    textures: Texture[];
    texturePaths: string[];
    xPosition: number;
}

export default class MaterialRadioGroup extends Component {
    props: MaterialRadioGroupProps;
    disabled: Boolean;
    customSelected: Boolean;
    selected: number;//just gonna go with key here
    //@ts-ignore
    file;

    static propTypes = {
        material: PropTypes.instanceOf(Material),
        textures: PropTypes.arrayOf(PropTypes.instanceOf(Texture)),
        texturePaths: PropTypes.arrayOf(PropTypes.string),
        xPosition: PropTypes.number
    }

    constructor(props: MaterialRadioGroupProps) {
        super(props);

        this.file = React.createRef();

        this.selected = -1;
        this.disabled = true;
        this.customSelected = false;
        this.props.material.material.visible = false;

        this.disable = this.disable.bind(this);
        this.toggleSelected = this.toggleSelected.bind(this);
        this.setCustom = this.setCustom.bind(this);
        this.triggerClick = this.triggerClick.bind(this);
    }

    disable() {
        this.selected = -1;
        this.disabled = true;
        this.customSelected = false;
        this.props.material.material.visible = false;
        this.forceUpdate();
    }

    async toggleSelected(selected: number) {
        if (selected == this.selected) {
            this.disable();
        } else {
            this.disabled = false;
            this.customSelected = false;
            const newSelectedTexture = await this.props.textures[selected].getTexture();
            this.props.material.material.visible = true;
            this.props.material.material.map = newSelectedTexture;
            this.props.material.material.needsUpdate = true;
            this.selected = selected;
            this.forceUpdate();
        }
    }
    triggerClick() {
        //@ts-ignore
        this.file.current.click();
    }

    async setCustom(e: React.ChangeEvent<HTMLInputElement>) {
        const path = window.URL.createObjectURL(e.target.files[0]);
        const texture = new Texture(path, this.props.xPosition);
        this.disabled = false;
        this.customSelected = true;
        const tex = await texture.getTexture();
        this.props.material.material.visible = true;
        this.props.material.material.map = tex;
        this.props.material.material.needsUpdate = true;
        this.forceUpdate();
    }

    render() {
        const disableButton = (
            <Radio 
                onClickCallback={this.disable} 
                selected={this.disabled}>
                    <FontAwesomeIcon className="icon" icon={faBan}/>
            </Radio>
        );
        const textures = this.props.texturePaths.map((path, i) => 
            <Radio 
                key={i}
                value={i}
                onClickCallback={this.toggleSelected}
                selected={!this.disabled && !this.customSelected && this.selected == i}>
                <img className="icon" src={path}/>
            </Radio>
        )
        const customButton = (
            <Radio
                onClickCallback={this.triggerClick}
                selected={this.customSelected}>
                <FontAwesomeIcon className="icon" icon={faUpload}/>
            </Radio>
        )
        return (
            <div className="swatchContainer">
                {disableButton}
                {textures}
                {customButton}
                <input hidden ref={this.file} type="file" accept="image/png" onChange={this.setCustom}/>
            </div>
        )
    }
}