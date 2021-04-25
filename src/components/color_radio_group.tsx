import React, { Component, createRef, RefObject } from 'react';
import * as PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import { ColorResult } from 'react-color';

import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { Material } from '../models/materials/material';

import Radio from './radio';
import MyColorPicker from './color';
import { faTint } from '@fortawesome/free-solid-svg-icons';

interface ColorRadioGroupProps {
    title: string;
    materials: Material[];
    colors: string[];
}

export default class ColorRadioGroup extends Component {
    props: ColorRadioGroupProps;
    disabled: boolean;
    selectedColor: string;
    customColor: string;
    colorRefs: RefObject<Radio>[] = [];
    idPrefix: string;

    static propTypes = {
        title: PropTypes.string,
        materials: PropTypes.arrayOf(PropTypes.instanceOf(Material)),
        colors: PropTypes.arrayOf(PropTypes.string),
    };

    constructor(props: ColorRadioGroupProps) {
        super(props);

        this.customColor = tinycolor.random().toHexString();
        this.idPrefix = this.props.title.replace(/\s/g, '-').toLowerCase();

        const refCount = this.props.colors.length + 1 + (!this.props.materials[0].isRequired ? 1 : 0);

        for (let i = 0; i < refCount; i++) {
            this.colorRefs.push(createRef<Radio>());
        }

        this.disableMaterial = this.disableMaterial.bind(this);
        this.setColor = this.setColor.bind(this);
        this.setCustomColor = this.setCustomColor.bind(this);
        this.setToCustomColor = this.setToCustomColor.bind(this);
        this.moveFocus = this.moveFocus.bind(this);
    }

    componentDidMount(): void {
        //random start values
        const count = this.props.colors.length;
        const index = Math.floor(Math.random() * Math.floor(count));
        this.setColor(this.props.colors[index]);
    }

    moveFocus(index: number, direction: number): void {
        const length = this.colorRefs.length;
        const ind = (index + direction + length) % length;
        this.colorRefs[ind].current.focus();
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
            <Radio
                onClickCallback={this.disableMaterial}
                selected={this.disabled}
                ref={this.colorRefs[0]}
                onMoveFocus={(dir: number): void => this.moveFocus(0, dir)}
                label="Disable"
                faIcon={faBan}
            ></Radio>
        );

        this.props.colors.forEach(color => {
            isSelected = isSelected || this.selectedColor == color;
        });

        const colors = this.props.colors.map((color, i) => (
            <Radio
                key={i}
                ref={this.colorRefs[i + (isRequired ? 0 : 1)]}
                color={color}
                onClickCallback={this.setColor}
                selected={!this.disabled && this.selectedColor == color}
                onMoveFocus={(dir: number): void => this.moveFocus(i + (isRequired ? 0 : 1), dir)}
                label={color}
            />
        ));

        const customColorButton = (
            <Radio
                ref={this.colorRefs[this.colorRefs.length - 1]}
                onClickCallback={this.setToCustomColor}
                selected={!isSelected}
                color={this.customColor}
                className="custom-color"
                onMoveFocus={(dir: number): void => this.moveFocus(this.colorRefs.length - 1, dir)}
                label="Custom Color"
                faIcon={faTint}
            ></Radio>
        );

        return (
            <>
                <h3 id={`${this.idPrefix}-label`}>{this.props.title}</h3>
                <div className="swatch-container color-container ">
                    <div
                        id={this.idPrefix}
                        className="color-group"
                        role="radiogroup"
                        aria-labelledby={`${this.idPrefix}-label`}
                    >
                        {disableButton}
                        {colors}
                        {customColorButton}
                    </div>
                    <MyColorPicker color={this.customColor} onChange={this.setCustomColor} />
                </div>
            </>
        );
    }
}
