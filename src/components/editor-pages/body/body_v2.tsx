import React, {Component, FormEventHandler} from "react";
import * as PropTypes from "prop-types";

import AvatarPart from "../../../models/avatar_part";
import { Material } from "../../../models/materials/material";
import { BaseMaterial } from "../../../models/materials/base_material";
import { AvatarPartRadioGroup, Radio, RadioGroup } from "../../color_swatches";

import blush from "../../../images/textures/blush_default.png";
import eyes from "../../../images/textures/eyes_default.png";
import eyeWhites from "../../../images/textures/eye_whites.png";
import hair from "../../../images/textures/hair_default.png";
import shirt from "../../../images/textures/shirt_default.png";
import skin from "../../../images/textures/skin_default.png";

import curvy from "../../../images/icons/icons_curvy.png";
import straight from "../../../images/icons/icons_straight.png";
import blair from "../../../images/icons/icons_hair_blair.png";
import long from "../../../images/icons/icons_hair_long.png";
import messy from "../../../images/icons/icons_hair_messy.png";

export default class BodyPage extends Component {
    blushMaterial: Material;
    eyesMaterial: Material;
    eyeWhitesMaterial: Material;
    hairMaterial: Material;
    shirtMaterial: Material;
    skinMaterial: Material;
    props: BodyProps;

    static propTypes = {
        avatarPart: PropTypes.instanceOf(AvatarPart),
        hairPart: PropTypes.instanceOf(AvatarPart)
    }

    constructor(props:Object) {
        super(props);

        this.blushMaterial = new Material(blush);
        this.eyesMaterial = new BaseMaterial(eyes);
        this.eyeWhitesMaterial = new BaseMaterial(eyeWhites);
        this.hairMaterial = new BaseMaterial(hair);
        this.shirtMaterial = new BaseMaterial(shirt);
        this.skinMaterial = new BaseMaterial(skin);


        this.props.avatarPart.assignNewMaterials(
            [   
                this.skinMaterial,
                this.eyeWhitesMaterial,
                this.eyesMaterial,
                this.blushMaterial, 
                this.shirtMaterial, 
            ]);
        this.props.hairPart.assignNewMaterials(
            [
                this.hairMaterial
            ]
        )
    }

    render() {
        return (
            <div>
                <div>
                    <span>Body</span>
                    <AvatarPartRadioGroup
                        avatarPart={this.props.avatarPart}
                        iconPaths={[curvy, straight]}
                        />
                    <RadioGroup
                        material={this.skinMaterial}
                        colors= {["#503335", "#592f2a", "#a1665e", "#c58c85", "#d1a3a4", "#ecbcb4", "#FFE2DC"]}
                        />

                    <RadioGroup
                        material={this.blushMaterial}
                        colors= {["#551F25", "#82333C", "#983E38", "#DC6961","#e3b9a1"]}
                        />
                </div>
                <div>
                    <AvatarPartRadioGroup
                        avatarPart={this.props.hairPart}
                        iconPaths={[blair, long, messy]}
                        />
                    <RadioGroup
                        material={this.hairMaterial}
                        colors= {["#2F2321", "#5C4033", "#C04532", "#B9775A", "#E6C690", "#FCE3B8", "#E6E6E6"]}
                        />
                    <RadioGroup
                        material={this.eyesMaterial}
                        colors= {["#552919", "#915139", "#917839", "#718233", "#338251", "#335A82"]}
                        />
                </div>
            </div>
        )
    }
}

interface BodyProps {
    avatarPart: AvatarPart
    hairPart: AvatarPart
}