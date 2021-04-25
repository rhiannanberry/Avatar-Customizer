import React, { Component, RefObject, createRef } from 'react';
import * as PropTypes from 'prop-types';

import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload';

import { Material } from '../models/materials/material';
import Texture from '../models/materials/texture';
import Radio from './radio';

interface MaterialRadioGroupProps {
    material: Material;
    textures: Texture[];
    texturePaths: string[];
    xPosition: number;
    title: string;
}

export default class MaterialRadioGroup extends Component {
    props: MaterialRadioGroupProps;
    disabled: boolean;
    customSelected: boolean;
    selected: number; //just gonna go with key here
    file: React.RefObject<HTMLInputElement>;
    radioRefs: RefObject<Radio>[] = [];
    idPrefix: string;

    static propTypes = {
        title: PropTypes.string,
        material: PropTypes.instanceOf(Material),
        textures: PropTypes.arrayOf(PropTypes.instanceOf(Texture)),
        texturePaths: PropTypes.arrayOf(PropTypes.string),
        xPosition: PropTypes.number,
    };

    constructor(props: MaterialRadioGroupProps) {
        super(props);

        this.file = React.createRef<HTMLInputElement>();
        this.idPrefix = this.props.title.replace(/\s/g, '-').toLowerCase();

        this.selected = -1;
        this.disabled = true;
        this.customSelected = false;
        this.props.material.material.visible = false;

        this.disable = this.disable.bind(this);
        this.toggleSelected = this.toggleSelected.bind(this);
        this.setCustom = this.setCustom.bind(this);
        this.triggerClick = this.triggerClick.bind(this);
        this.moveFocus = this.moveFocus.bind(this);

        const refCount = this.props.textures.length + 2;
        for (let i = 0; i < refCount; i++) {
            this.radioRefs.push(createRef<Radio>());
        }
    }

    disable(): void {
        this.selected = -1;
        this.disabled = true;
        this.customSelected = false;
        this.props.material.material.visible = false;
        this.forceUpdate();
    }

    moveFocus(index: number, direction: number): void {
        const length = this.radioRefs.length;
        const ind = (index + direction + length) % length;
        this.radioRefs[ind].current.focus();
    }

    async toggleSelected(selected: number): Promise<void> {
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
    triggerClick(): void {
        this.file.current.click();
    }

    async setCustom(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
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

    render(): JSX.Element {
        const disableButton = (
            <Radio
                onClickCallback={this.disable}
                ref={this.radioRefs[0]}
                onMoveFocus={(dir: number): void => this.moveFocus(0, dir)}
                selected={this.disabled}
                className="texture"
                faIcon={faBan}
            ></Radio>
        );
        const textures = this.props.texturePaths.map((path, i) => (
            <Radio
                key={i}
                value={i}
                ref={this.radioRefs[i + 1]}
                onMoveFocus={(dir: number): void => this.moveFocus(i + 1, dir)}
                onClickCallback={this.toggleSelected}
                selected={!this.disabled && !this.customSelected && this.selected == i}
                className="texture"
                icon={path}
            ></Radio>
        ));
        const customButton = (
            <Radio
                ref={this.radioRefs[textures.length + 1]}
                onMoveFocus={(dir: number): void => this.moveFocus(textures.length + 1, dir)}
                onClickCallback={(): void => this.file.current.click()}
                selected={this.customSelected}
                className="texture"
                faIcon={faUpload}
            />
        );
        return (
            <>
                <h3 id={`${this.idPrefix}-label`}>{this.props.title}</h3>
                <div className="swatch-container" role="radiogroup" aria-labelledby={`${this.idPrefix}-label`}>
                    {disableButton}
                    {textures}
                    {customButton}
                    <input hidden ref={this.file} type="file" accept="image/png" onChange={this.setCustom} />
                </div>
            </>
        );
    }
}
