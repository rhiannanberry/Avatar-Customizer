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
import headwear from '../includes/textures/headwear_default.png';
import facialHair from '../includes/textures/facial_hair_default.png';
import jacket from '../includes/textures/jacket_default.png';
import shirt from '../includes/textures/shirt_default.png';
import skin from '../includes/textures/skin_default.png';

import duck from '../includes/textures/duck.png';
import eyelligatorWhite from '../includes/textures/eyelligator_white.png';
import eyelligatorBlack from '../includes/textures/eyelligator_black.png';

import curvy from '../includes/icons/body_curvy.svg';
import straight from '../includes/icons/body_straight.svg';
import soft from '../includes/icons/body_soft.svg';
import blair from '../includes/icons/hair_blair.png';
import compressed from '../includes/icons/hair_compressed.png';
import long from '../includes/icons/hair_long.png';
import short from '../includes/icons/hair_short.png';
import puffs from '../includes/icons/hair_poofs.png';
import swoop from '../includes/icons/hair_swoop.png';
import locs from '../includes/icons/h_locs.png';

import highPony from '../includes/icons/hh_high_pony.png';
import lowPony from '../includes/icons/hh_low_pony.png';

import hijab from '../includes/icons/headwear_hijab.png';
import ballcap from '../includes/icons/headwear_ballcap.png';
import beanie from '../includes/icons/headwear_beanie.png';

import moustache1 from '../includes/icons/moustache_1.png';
import moustache2 from '../includes/icons/moustache_2.png';
import moustache3 from '../includes/icons/moustache_3.png';
import moustache4 from '../includes/icons/moustache_4.png';

import beard1 from '../includes/icons/beard_1.png';
import beard2 from '../includes/icons/beard_2.png';
import beard3 from '../includes/icons/beard_3.png';
import beard4 from '../includes/icons/beard_4.png';
import beard5 from '../includes/icons/beard_5.png';

import cat from '../includes/icons/glasses_cat.svg';
import round from '../includes/icons/glasses_circle.svg';
import square from '../includes/icons/glasses_square.svg';

interface EditorProps {
    basePart: AvatarPart;
    bodyPart: AvatarPart;
    glassesPart: AvatarPart;
    hairPart: AvatarPart;
    hair2Part: AvatarPart;
    headwearPart: AvatarPart;
    moustachesPart: AvatarPart;
    beardsPart: AvatarPart;
}

export default class Editor extends Component {
    blushMaterial: Material;
    eyesMaterial: Material;
    eyebrowsMaterial: Material;
    eyeWhitesMaterial: Material;
    glassesMaterial: Material;
    hairMaterial: Material;
    headwearMaterial: Material;
    facialHairMaterial: Material;
    jacketMaterial: Material;
    shirtMaterial: Material;
    skinMaterial: Material;
    selectedPage: number;
    logoPaths: string[];

    backLogoTextures: Texture[];
    frontLogoTextures: Texture[];

    backLogoMaterial: Material;
    frontLogoMaterial: Material;
    props: EditorProps;

    beardPaths: string[];
    moustachePaths: string[];
    beardTextures: Texture[];
    moustacheTextures: Texture[];
    beardMaterial: Material;
    moustacheMaterial: Material;

    static propTypes = {
        basePart: PropTypes.instanceOf(AvatarPart),
        bodyPart: PropTypes.instanceOf(AvatarPart),
        glassesPart: PropTypes.instanceOf(AvatarPart),
        hairPart: PropTypes.instanceOf(AvatarPart),
        hair2Part: PropTypes.instanceOf(AvatarPart),
        headwearPart: PropTypes.instanceOf(AvatarPart),
        moustachesPart: PropTypes.instanceOf(AvatarPart),
        beardsPart: PropTypes.instanceOf(AvatarPart),
    };

    constructor(props: EditorProps) {
        super(props);

        this.logoPaths = [duck, eyelligatorWhite, eyelligatorBlack];
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
        this.headwearMaterial = new BaseMaterial(headwear);
        this.jacketMaterial = new Material(jacket);
        this.shirtMaterial = new BaseMaterial(shirt);
        this.skinMaterial = new BaseMaterial(skin);
        this.facialHairMaterial = new BaseMaterial(facialHair);

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
        this.props.hair2Part.assignNewMaterials([this.hairMaterial]);
        this.props.glassesPart.assignNewMaterials([this.glassesMaterial]);
        this.props.headwearPart.assignNewMaterials([this.headwearMaterial]);
        this.props.moustachesPart.assignNewMaterials([this.facialHairMaterial]);
        this.props.beardsPart.assignNewMaterials([this.facialHairMaterial]);
        this.selectedPage = 0;
        this.changePage = this.changePage.bind(this);
    }

    changePage(selectedPage: number): void {
        this.selectedPage = selectedPage;
        this.forceUpdate();
    }

    render(): JSX.Element {
        const classes = function(index: number, selected: number): string {
            return `page${selected === index ? ' selected' : ''}`;
        };
        const label = ['body', 'hair', 'facial-hair', 'top', 'accessories'];
        return (
            <div>
                <PageRadioGroup
                    pageLabels={label}
                    pageNames={['Body', 'Hair', 'Facial Hair', 'Top', 'Accessories']}
                    onClickCallback={this.changePage}
                />
                <div
                    id={`${label[0]}-page`}
                    aria-labelledby={label[0]}
                    role="tabpanel"
                    className={classes(0, this.selectedPage)}
                >
                    <AvatarPartRadioGroup
                        title="Body Shape"
                        avatarPart={this.props.bodyPart}
                        iconPaths={[curvy, soft, straight]}
                        labels={['curvy', 'soft', 'straight']}
                    />
                    <ColorRadioGroup
                        title="Skin Color"
                        materials={[this.skinMaterial]}
                        colors={['#503335', '#592f2a', '#a1665e', '#c58c85', '#d1a3a4', '#ecbcb4', '#FFE2DC']}
                    />
                    <ColorRadioGroup
                        title="Blush Color"
                        materials={[this.blushMaterial]}
                        colors={['#300d1a', '#551F25', '#82333C', '#983E38', '#DC6961', '#e3b9a1']}
                    />
                    <ColorRadioGroup
                        title="Eye Color"
                        materials={[this.eyesMaterial]}
                        colors={['#552919', '#915139', '#917839', '#718233', '#338251', '#335A82', '#9bcfd3']}
                    />
                </div>
                <div
                    id={`${label[1]}-page`}
                    aria-labelledby={label[1]}
                    role="tabpanel"
                    className={classes(1, this.selectedPage)}
                >
                    <AvatarPartRadioGroup
                        title="Hair Style"
                        avatarPart={this.props.hairPart}
                        iconPaths={[blair, long, short, compressed, puffs, swoop, locs]}
                        labels={['h_blair', 'h_long', 'h_short', 'h_compressed', 'h_puffs', 'h_swoop', 'h_locs']}
                    />
                    <AvatarPartRadioGroup
                        title="Hair Extensions"
                        avatarPart={this.props.hair2Part}
                        iconPaths={[highPony, lowPony]}
                        labels={['high_pony', 'low_pony']}
                    />
                    <ColorRadioGroup
                        title="Hair Color"
                        materials={[this.hairMaterial, this.eyebrowsMaterial]}
                        colors={['#2F2321', '#5C4033', '#C04532', '#B9775A', '#E6C690', '#FCE3B8', '#E6E6E6']}
                    />
                </div>
                <div
                    id={`${label[2]}-page`}
                    aria-labelledby={label[2]}
                    role="tabpanel"
                    className={classes(2, this.selectedPage)}
                >
                    <AvatarPartRadioGroup
                        title="Moustaches"
                        avatarPart={this.props.moustachesPart}
                        iconPaths={[moustache1, moustache2, moustache3, moustache4]}
                        labels={['moustache1', 'moustache2', 'moustache3', 'moustache4']}
                    />
                    <AvatarPartRadioGroup
                        title="Beards"
                        avatarPart={this.props.beardsPart}
                        iconPaths={[beard1, beard2, beard3, beard4, beard5]}
                        labels={['beard1', 'beard2', 'beard3', 'beard4', 'beard5']}
                    />
                    <ColorRadioGroup
                        title="Facial Hair Color"
                        materials={[this.facialHairMaterial]}
                        colors={['#2F2321', '#5C4033', '#C04532', '#B9775A', '#E6C690', '#FCE3B8', '#E6E6E6']}
                    />
                </div>
                <div
                    id={`${label[3]}-page`}
                    aria-labelledby={label[3]}
                    role="tabpanel"
                    className={classes(3, this.selectedPage)}
                >
                    <ColorRadioGroup
                        title="Shirt Color"
                        materials={[this.shirtMaterial]}
                        colors={['#D72638', '#3F88C5', '#F49D37', '#140F2D', '#FBFBF2', '#dec35e', '#75885d']}
                    />
                    <ColorRadioGroup
                        title="Jacket"
                        materials={[this.jacketMaterial]}
                        colors={['#AD1F2D', '#2A618D', '#D5770B', '#33236C', '#da5984', '#acb19e']}
                    />
                    <MaterialRadioGroup
                        title="Front Logo"
                        material={this.frontLogoMaterial}
                        textures={this.frontLogoTextures}
                        texturePaths={this.logoPaths}
                        xPosition={148}
                    />
                    <MaterialRadioGroup
                        title="Back Logo"
                        material={this.backLogoMaterial}
                        textures={this.backLogoTextures}
                        texturePaths={this.logoPaths}
                        xPosition={662}
                    />
                </div>
                <div
                    id={`${label[4]}-page`}
                    aria-labelledby={label[4]}
                    role="tabpanel"
                    className={classes(4, this.selectedPage)}
                >
                    <AvatarPartRadioGroup
                        title="Glasses"
                        avatarPart={this.props.glassesPart}
                        iconPaths={[cat, round, square]}
                        labels={['cat', 'circle', 'square']}
                    />
                    <ColorRadioGroup
                        title="Color"
                        materials={[this.glassesMaterial]}
                        colors={['#1a1616', '#a82b27', '#dab560', '#e1dbc4', '#9a9a9a', '#bfcb5d', '#5d5dcb']}
                    />
                    <AvatarPartRadioGroup
                        title="Headwear"
                        avatarPart={this.props.headwearPart}
                        iconPaths={[ballcap, beanie, hijab]}
                        labels={['headwear_ballcap', 'headwear_beanie', 'headwear_hijab']}
                    />
                    <ColorRadioGroup
                        title="Headwear Color"
                        materials={[this.headwearMaterial]}
                        colors={['#D72638', '#3F88C5', '#F49D37', '#140F2D', '#FBFBF2', '#dec35e', '#75885d']}
                    />
                </div>
            </div>
        );
    }
}
