import React, { Component } from "react";
import * as THREE from "three";

import PropTypes from "prop-types";
import {DisableButton, PresetColorButton, CustomColorButton, RadioButton} from "./buttons"

import BodyEditor from "./body-editor"
import HeadEditor from "./head-editor"
import ShirtEditor from "./shirt-editor"
import JacketEditor from "./jacket-editor"

import "../stylesheets/editor"

import { LabeledTexture } from "../labeled-texture";
import Material from "./material"

import skin from "../../includes/textures/skin_default.png";
import blush from "../../includes/textures/blush_default.png";
import hair from "../../includes/textures/hair_default.png";

export class Editor extends Component{
    static propTypes = {
        model : PropTypes.object
    }

    constructor(props) {
        super(props);
        this.body = React.createRef();
        this.head = React.createRef();
        this.shirt = React.createRef();
        this.jacket = React.createRef();
        
        this.materials = [
            new Material(this.props.model.material.clone(), "skin", [new LabeledTexture(skin)]),
            new Material(this.props.model.material.clone(), "blush", [new LabeledTexture(blush)]),
            new Material(this.props.model.material.clone(), "hair", [new LabeledTexture(hair)])

        ];
        
/*
        for (let i = 0; i < len; i++) {
            this.props.model.geometry.addGroup(0, Infinity, i+1);
            this.props.model.material.push(this.materials[i].material);
        }*/

    }
    
    componentDidMount() {
        var counter = 0;
        const backgroundMaterial = this.props.model.material.clone();
        this.props.model.geometry.clearGroups();

        this.props.model.geometry.addGroup(0, Infinity, counter);
        this.props.model.material.push(backgroundMaterial);

        counter = this.addMaterials(1, this.body.current.materials);
        //counter = this.addMaterials(counter, this.body.current.materials);

        this.changePage("Body")
    }

    addMaterials(counter, materials) {
        for (i=0; i<materials.length; i++) {
            this.props.model.geometry.addGroup(0, Infinity, counter+i);
            this.props.model.material.push(materials[i].material);
        }
        return counter+materials.length;
    }

    changePage(value) {
        this.body.current.setActive(value === "Body");
        this.head.current.setActive(value === "Head");
        this.shirt.current.setActive(value === "Shirt");
        this.jacket.current.setActive(value === "Jacket");
    }

    render() {
        return(
        <>
            <div id="pageButtons">
                <RadioButton name="page" onChange={(e) => this.changePage(e.target.value)} defaultChecked={true} value="Body" />
                <RadioButton name="page" onChange={(e) => this.changePage(e.target.value)} defaultChecked={false} value="Head" />
                <RadioButton name="page" onChange={(e) => this.changePage(e.target.value)} defaultChecked={false} value="Shirt" />
                <RadioButton name="page" onChange={(e) => this.changePage(e.target.value)} defaultChecked={false} value="Jacket" />
            </div>
            <BodyEditor ref={this.body} model={this.props.model}/>
            <HeadEditor ref={this.head} model={this.props.model}/>
            <ShirtEditor ref={this.shirt} model={this.props.model}/>
            <JacketEditor ref={this.jacket} model={this.props.model}/>
        </>
        );
    }

}