import React, { Component,  } from "react";
import ReactDOM from "react-dom"
import * as PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";
import { faPalette } from "@fortawesome/free-solid-svg-icons/faPalette";

import { Material } from "../models/materials/material";
import { Hue, Saturation} from 'react-color/lib/components/common'

import colorPicker, { ColorPicker } from "./color-picker";
import AvatarPart from "../models/avatar_part";
import { CustomPicker } from "react-color";
import MyColorPicker from "./color";


interface RadioProps {
    children: Object;
    color: string;
    onClickCallback: Function;
    selected: Boolean;
    setTitle: Boolean;
    value: string|number;
}

export class Radio extends Component {
    props: RadioProps;
    value: string|number;

    static propTypes = {
        children: PropTypes.object,
        color: PropTypes.string,
        onClickCallback: PropTypes.func,
        selected: PropTypes.bool,
        setTitle: PropTypes.bool,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    }

    static defaultProps = {
        // @ts-ignore
        children: null,
        color: "#b8b8b8",
        selected: false,
        setTitle: false,
        // @ts-ignore
        value: null
    }

    constructor(props: RadioProps) {
        super(props);

        this.value = this.props.value != null ? this.props.value : this.props.color;
        this.onClickValue = this.onClickValue.bind(this);
    }

    onClickValue() {
        this.props.onClickCallback(this.value);
        //only send back up if SUCCESSFUL for texture upload attempts
    }

    render() {
        var swatchStyle = {
            backgroundColor: this.props.color,
            boxShadow: this.props.selected ? `0 0 6px ${this.props.color}` : null
        };
        return (
            <span className="swatch" onClick={this.onClickValue} title={this.props.setTitle? this.value as string : null}>
                <div style={swatchStyle} className="inner">
                    {this.props.children}
                </div>
            </span>
        )
    }
}


interface ColorRadioGroupProps {
    material: Material;
    colors: string[];
}

export class ColorRadioGroup extends Component {
    props: ColorRadioGroupProps;
    disabled: Boolean;
    selectedColor: string;
    customColor: string;

    static propTypes = {
        material: PropTypes.instanceOf(Material),
        colors: PropTypes.arrayOf(PropTypes.string)
    }

    constructor(props: ColorRadioGroupProps) {
        super(props);

        this.setColor = this.setColor.bind(this);
        this.setCustomColor = this.setCustomColor.bind(this);
        this.setToCustomColor = this.setToCustomColor.bind(this);

        this.disableMaterial = this.disableMaterial.bind(this);

        this.customColor = "#ffaabb";

    }
    
    componentDidMount() {
        this.randomStart();
    }

    setColor(color: string) {
        this.disabled = false;
        this.selectedColor = color;
        this.props.material.material.visible = true;
        this.props.material.material.color.setStyle(color);
        this.forceUpdate();
    }

    setCustomColor(color: object) {
        // @ts-ignore
        this.customColor = color.hex;
        //@ts-ignore
        this.setColor(color.hex);
    }

    setToCustomColor() {
        this.setColor(this.customColor);
    }

    disableMaterial() {
        this.disabled = true;
        this.props.material.material.visible = false;
        this.forceUpdate();
    }

    randomStart() {
        const count = this.props.colors.length;
        const index = Math.floor(Math.random() * Math.floor(count));
        this.setColor(this.props.colors[index]);
    }

    render() {
        const isDisabled = this.props.material.material.visible;
        const isRequired = this.props.material.isRequired;

        let isSelected = this.disabled;
    
        const disableButton = isRequired 
                ? null 
                :   <Radio onClickCallback={this.disableMaterial} 
                            selected={this.disabled}>
                            <FontAwesomeIcon className="icon" icon={faBan}/>
                    </Radio>;

        this.props.colors.forEach(color => {
            isSelected = isSelected || (this.selectedColor == color);
        })

        const colors = this.props.colors.map((color, i) => 
            <Radio key={i} 
                    color={color} 
                    onClickCallback={this.setColor} 
                    selected={!this.disabled && this.selectedColor == color} 
                    setTitle />
        );

        //TODO: make setting title on custom color work
        const customColorButton = (
            <Radio onClickCallback={this.setToCustomColor} 
                selected={!isSelected}
                color={this.customColor}
                setTitle >
                <FontAwesomeIcon className="icon" icon={faPalette} />
            </Radio>
        )

        return (
            <div className="swatchContainer">
                {disableButton}
                {colors}
                {customColorButton}
                <MyColorPicker color={this.customColor} onChange={this.setCustomColor}/>
            </div>
        );
    }
}

interface AvatarPartRadioGroupProps {
    avatarPart: AvatarPart;
    iconPaths: string[];
}

export class AvatarPartRadioGroup extends Component {
    disabled: Boolean;
    isRequired: Boolean;
    props: AvatarPartRadioGroupProps;

    static propTypes = {
        avatarPart: PropTypes.instanceOf(AvatarPart),
        iconPaths: PropTypes.arrayOf(PropTypes.string)
    }

    constructor(props: ColorRadioGroupProps) {
        super(props);

        this.isRequired = this.props.avatarPart.isRequired;

        this.disablePart = this.disablePart.bind(this);
        this.togglePart = this.togglePart.bind(this);
    }

    disablePart() {
        this.props.avatarPart.disable();
        this.forceUpdate();
    }

    togglePart(partIndex: number) {
        this.props.avatarPart.toggleMesh(partIndex);
        this.forceUpdate();
    }

    render() {    
        const disableButton = this.isRequired 
                ? null 
                :   <Radio onClickCallback={this.disablePart} 
                            selected={this.props.avatarPart.disabled}>
                            <FontAwesomeIcon className="icon" icon={faBan}/>
                    </Radio>;

        const parts = this.props.iconPaths.map((path, i) => 
            <Radio key={i} 
                onClickCallback={this.togglePart} 
                value={i}
                selected={!this.props.avatarPart.disabled && this.props.avatarPart.isSelected(i)}>
                    <img className="icon" src={path}/>
            </Radio>
        );

        return (
            <div className="swatchContainer">
                {disableButton}
                {parts}
            </div>
        );
    }
}


interface PageRadioGroupProps {
    iconPaths: string[],
    pageNames: string[],
    onClickCallback: Function
}
export class PageRadioGroup extends Component {
    props: PageRadioGroupProps;
    selectedPage: string;

    static propTypes = {
        iconPaths: PropTypes.arrayOf(PropTypes.string),
        pageNames: PropTypes.arrayOf(PropTypes.string),
        onClickCallback: PropTypes.func
    }

    constructor(props: PageRadioGroupProps) {
        super(props);

        this.selectedPage = this.props.pageNames[0];
        this.togglePage = this.togglePage.bind(this);
    }

    togglePage(pageName: string) {
        this.selectedPage = pageName;
        this.props.onClickCallback(pageName);
        this.forceUpdate();
    }

    render() {
        const buttons = this.props.iconPaths.map((path, i) => 
            <Radio key={i} 
                onClickCallback={this.togglePage} 
                value={this.props.pageNames[i]}
                selected={this.selectedPage == this.props.pageNames[i]}
                setTitle>
                <img className="icon" src={path}/>
            </Radio>
        );

        return (
            <div className="swatchContainer">
                {buttons}
            </div>
        );
    }
}