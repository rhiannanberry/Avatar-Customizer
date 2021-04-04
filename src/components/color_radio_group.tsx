import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import { ColorResult } from 'react-color';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faPalette } from '@fortawesome/free-solid-svg-icons/faPalette';

import { Material } from '../models/materials/material';

import Radio from './radio';
import MyColorPicker from './color';

interface ColorRadioGroupProps {
    materials: Material[];
    colors: string[];
}

export default class ColorRadioGroup extends Component {
    props: ColorRadioGroupProps;
    disabled: boolean;
    selectedColor: string;
    customColor: string;

    static propTypes = {
        materials: PropTypes.arrayOf(PropTypes.instanceOf(Material)),
        colors: PropTypes.arrayOf(PropTypes.string),
    };

    constructor(props: ColorRadioGroupProps) {
        super(props);

        this.customColor = tinycolor.random().toHexString();

        this.disableMaterial = this.disableMaterial.bind(this);
        this.setColor = this.setColor.bind(this);
        this.setCustomColor = this.setCustomColor.bind(this);
        this.setToCustomColor = this.setToCustomColor.bind(this);
    }

    componentDidMount(): void {
        //random start values
        const count = this.props.colors.length;
        const index = Math.floor(Math.random() * Math.floor(count));
        this.setColor(this.props.colors[index]);
    }

    setColor(color: string): void {
        this.disabled = false;
        this.selectedColor = color;
        this.props.materials.forEach(material => {
            material.material.visible = true;
            material.material.color.setStyle(color);
        });
        this.forceUpdate();
    }

    setCustomColor(color: ColorResult): void {
        this.customColor = color.hex;
        this.setColor(color.hex);
    }

    setToCustomColor(): void {
        this.setColor(this.customColor);
    }

    disableMaterial(): void {
        this.disabled = true;
        this.props.materials.forEach(material => {
            material.material.visible = false;
        });
        this.forceUpdate();
    }

    render(): JSX.Element {
        const isRequired = this.props.materials[0].isRequired;

        let isSelected = this.disabled;

        const disableButton = isRequired ? null : (
            <Radio onClickCallback={this.disableMaterial} selected={this.disabled}>
                <FontAwesomeIcon className="icon" icon={faBan} />
            </Radio>
        );

        this.props.colors.forEach(color => {
            isSelected = isSelected || this.selectedColor == color;
        });

        const colors = this.props.colors.map((color, i) => (
            <Radio
                key={i}
                color={color}
                onClickCallback={this.setColor}
                selected={!this.disabled && this.selectedColor == color}
                setTitle
            />
        ));

        //TODO: make setting title on custom color work
        const customColorButton = (
            <Radio onClickCallback={this.setToCustomColor} selected={!isSelected} color={this.customColor} setTitle>
                <FontAwesomeIcon className="icon" icon={faPalette} />
            </Radio>
        );

        return (
            <div className="swatchContainer">
                {disableButton}
                {colors}
                {customColorButton}
                <MyColorPicker color={this.customColor} onChange={this.setCustomColor} />
            </div>
        );
    }
}
