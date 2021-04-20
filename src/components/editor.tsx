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

import blush from '../includes/textures/blush_default.png';
import eyes from '../includes/textures/eyes_default.png';
import eyebrows from '../includes/textures/eyebrows_default.png';
import eyeWhites from '../includes/textures/eye_whites.png';
import glasses from '../includes/textures/glasses_default.png';
import hair from '../includes/textures/hair_default.png';
import jacket from '../includes/textures/jacket_default.png';
import shirt from '../includes/textures/shirt_default.png';
import skin from '../includes/textures/skin_default.png';

import duck from '../includes/textures/duck.png';

import bodyPage from '../includes/icons/icons_body.png';
import glassesPage from '../includes/icons/glasses.png';
import headPage from '../includes/icons/icons_head.png';
import shirtPage from '../includes/icons/icons_shirt.png';
//import bodyPage from "../includes/icons/icons_body.png";

import curvy from '../includes/icons/icons_curvy.png';
import straight from '../includes/icons/icons_straight.png';
import soft from '../includes/icons/soft.png';
import blair from '../includes/icons/icons_hair_blair.png';
import compressed from '../includes/icons/hair_compressed.png';
import long from '../includes/icons/icons_hair_long.png';
import messy from '../includes/icons/icons_hair_messy.png';
import puffs from '../includes/icons/hair_puffs.png';
import swoop from '../includes/icons/hair_swoop.png';

import cat from '../includes/icons/glasses_cat.png';
import round from '../includes/icons/glasses_round.png';
import square from '../includes/icons/glasses_square.png';

interface EditorProps {
    basePart: AvatarPart;
    bodyPart: AvatarPart;
    glassesPart: AvatarPart;
    hairPart: AvatarPart;
}

export default class Editor extends Component {
    blushMaterial: Material;
    eyesMaterial: Material;
    eyebrowsMaterial: Material;
    eyeWhitesMaterial: Material;
    glassesMaterial: Material;
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
        basePart: PropTypes.instanceOf(AvatarPart),
        bodyPart: PropTypes.instanceOf(AvatarPart),
        glassesPart: PropTypes.instanceOf(AvatarPart),
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
        this.glassesMaterial = new BaseMaterial(glasses);
        this.backLogoMaterial = new Material();
        this.frontLogoMaterial = new Material();
        this.hairMaterial = new BaseMaterial(hair);
        this.jacketMaterial = new Material(jacket);
        this.shirtMaterial = new BaseMaterial(shirt);
        this.skinMaterial = new BaseMaterial(skin);

        this.props.basePart.assignNewMaterials([
            this.skinMaterial,
            this.eyeWhitesMaterial,
            this.eyesMaterial,
            this.eyebrowsMaterial,
            this.blushMaterial,
        ]);

        this.props.bodyPart.assignNewMaterials([
            this.shirtMaterial,
            this.frontLogoMaterial,
            this.jacketMaterial,
            this.backLogoMaterial,
        ]);
        this.props.hairPart.assignNewMaterials([this.hairMaterial]);
        this.props.glassesPart.assignNewMaterials([this.glassesMaterial]);
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
                    iconPaths={[bodyPage, headPage, shirtPage, glassesPage]}
                    pageNames={['Body', 'Hair and Eyes', 'Top', 'Glasses']}
                    onClickCallback={this.changePage}
                />
                <div style={{ display: this.selectedPage == 'Body' ? 'block' : 'none' }}>
                    Body Shape
                    <AvatarPartRadioGroup
                        avatarPart={this.props.bodyPart}
                        iconPaths={[curvy, soft, straight]}
                        labels={['curvy', 'soft', 'straight']}
                    />
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
                    <AvatarPartRadioGroup
                        avatarPart={this.props.hairPart}
                        iconPaths={[blair, long, messy, compressed, puffs, swoop]}
                        labels={['blair', 'long', 'messy', 'compressed', 'puffs', 'swoop']}
                    />
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
                        colors={['#D72638', '#3F88C5', '#F49D37', '#140F2D', '#FBFBF2']}
                    />
                    Jacket
                    <ColorRadioGroup
                        materials={[this.jacketMaterial]}
                        colors={['#AD1F2D', '#2A618D', '#D5770B', '#33236C', '#F1F1D0']}
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
                <div style={{ display: this.selectedPage == 'Glasses' ? 'block' : 'none' }}>
                    Glasses
                    <AvatarPartRadioGroup
                        avatarPart={this.props.glassesPart}
                        iconPaths={[cat, round, square]}
                        labels={['Cat Eye', 'Circle', 'Square']}
                    />
                    Color
                    <ColorRadioGroup
                        materials={[this.glassesMaterial]}
                        colors={['#1a1616', '#a82b27', '#dab560', '#9a9a9a']}
                    />
                </div>
            </div>
        );
    }
}
