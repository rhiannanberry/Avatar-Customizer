import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

import AvatarPart from '../models/avatar_part';
import { Material } from '../models/materials/material';
import { BaseMaterial } from '../models/materials/base_material';
import AvatarPartRadioGroup from './avatar_part_radio_group';
import ColorRadioGroup from './color_radio_group';
import MaterialRadioGroup from './material_radio_group';
import PageRadioGroup from './page_radio_group';
import Texture from '../models/materials/texture';

import blush from '../images/textures/blush_default.png';
import eyes from '../images/textures/eyes_default.png';
import eyebrows from '../images/textures/eyebrows_default.png';
import eyeWhites from '../images/textures/eye_whites.png';
import hair from '../images/textures/hair_default.png';
import jacket from '../images/textures/jacket_default.png';
import shirt from '../images/textures/shirt_default.png';
import skin from '../images/textures/skin_default.png';

import duck from '../images/textures/duck.png';

import bodyPage from '../images/icons/icons_body.png';
import headPage from '../images/icons/icons_head.png';
import shirtPage from '../images/icons//icons_shirt.png';
//import bodyPage from "../images/icons/icons_body.png";

import curvy from '../images/icons/icons_curvy.png';
import straight from '../images/icons/icons_straight.png';
import blair from '../images/icons/icons_hair_blair.png';
import long from '../images/icons/icons_hair_long.png';
import messy from '../images/icons/icons_hair_messy.png';

interface EditorProps {
    bodyPart: AvatarPart;
    hairPart: AvatarPart;
}

export default class Editor extends Component {
    blushMaterial: Material;
    eyesMaterial: Material;
    eyebrowsMaterial: Material;
    eyeWhitesMaterial: Material;
    hairMaterial: Material;
    jacketMaterial: Material;
    shirtMaterial: Material;
    skinMaterial: Material;
    selectedPage: string;
    logoPaths: string[];
    backLogoTextures: Texture[];
    frontLogoTextures: Texture[];
    backLogoMaterial: Material;
    frontLogoMaterial: Material;
    props: EditorProps;

    static propTypes = {
        bodyPart: PropTypes.instanceOf(AvatarPart),
        hairPart: PropTypes.instanceOf(AvatarPart),
    };

    constructor(props: EditorProps) {
        super(props);

        this.logoPaths = [duck];
        this.backLogoTextures = this.logoPaths.map(path => {
            return new Texture(path, 662);
        });
        this.frontLogoTextures = this.logoPaths.map(path => {
            return new Texture(path, 148);
        });

        this.blushMaterial = new Material(blush);
        this.eyesMaterial = new BaseMaterial(eyes);
        this.eyebrowsMaterial = new BaseMaterial(eyebrows);
        this.eyeWhitesMaterial = new BaseMaterial(eyeWhites);
        this.backLogoMaterial = new Material();
        this.frontLogoMaterial = new Material();
        this.hairMaterial = new BaseMaterial(hair);
        this.jacketMaterial = new Material(jacket);
        this.shirtMaterial = new BaseMaterial(shirt);
        this.skinMaterial = new BaseMaterial(skin);

        this.props.bodyPart.assignNewMaterials([
            this.skinMaterial,
            this.eyeWhitesMaterial,
            this.eyesMaterial,
            this.eyebrowsMaterial,
            this.blushMaterial,
            this.shirtMaterial,
            this.frontLogoMaterial,
            this.jacketMaterial,
            this.backLogoMaterial,
        ]);
        this.props.hairPart.assignNewMaterials([this.hairMaterial]);

        this.selectedPage = 'Body';
        this.changePage = this.changePage.bind(this);
    }

    changePage(selectedPage: string): void {
        this.selectedPage = selectedPage;
        this.forceUpdate();
    }

    render(): JSX.Element {
        return (
            <div>
                <PageRadioGroup
                    iconPaths={[bodyPage, headPage, shirtPage]}
                    pageNames={['Body', 'Hair and Eyes', 'Top']}
                    onClickCallback={this.changePage}
                />
                <div style={{ display: this.selectedPage == 'Body' ? 'block' : 'none' }}>
                    Body Shape
                    <AvatarPartRadioGroup avatarPart={this.props.bodyPart} iconPaths={[curvy, straight]} />
                    Skin Color
                    <ColorRadioGroup
                        materials={[this.skinMaterial]}
                        colors={['#503335', '#592f2a', '#a1665e', '#c58c85', '#d1a3a4', '#ecbcb4', '#FFE2DC']}
                    />
                    Blush Color
                    <ColorRadioGroup
                        materials={[this.blushMaterial]}
                        colors={['#551F25', '#82333C', '#983E38', '#DC6961', '#e3b9a1']}
                    />
                </div>
                <div style={{ display: this.selectedPage == 'Hair and Eyes' ? 'block' : 'none' }}>
                    Hair Style
                    <AvatarPartRadioGroup avatarPart={this.props.hairPart} iconPaths={[blair, long, messy]} />
                    Hair Color
                    <ColorRadioGroup
                        materials={[this.hairMaterial, this.eyebrowsMaterial]}
                        colors={['#2F2321', '#5C4033', '#C04532', '#B9775A', '#E6C690', '#FCE3B8', '#E6E6E6']}
                    />
                    Eye Color
                    <ColorRadioGroup
                        materials={[this.eyesMaterial]}
                        colors={['#552919', '#915139', '#917839', '#718233', '#338251', '#335A82']}
                    />
                </div>
                <div style={{ display: this.selectedPage == 'Top' ? 'block' : 'none' }}>
                    Shirt Color
                    <ColorRadioGroup
                        materials={[this.shirtMaterial]}
                        colors={['#f2f2f2', '#cedded', '#92a1b1', '#3479b7', '#7d0c1e', '#262525']}
                    />
                    Jacket
                    <ColorRadioGroup
                        materials={[this.jacketMaterial]}
                        colors={['#f2f2f2', '#cedded', '#92a1b1', '#3479b7', '#7d0c1e', '#262525']}
                    />
                    Front Logo
                    <MaterialRadioGroup
                        material={this.frontLogoMaterial}
                        textures={this.frontLogoTextures}
                        texturePaths={this.logoPaths}
                        xPosition={148}
                    />
                    Back Logo
                    <MaterialRadioGroup
                        material={this.backLogoMaterial}
                        textures={this.backLogoTextures}
                        texturePaths={this.logoPaths}
                        xPosition={662}
                    />
                </div>
            </div>
        );
    }
}
