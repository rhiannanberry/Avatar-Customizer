import React, { Component } from "react";
import * as THREE from "three";

import PropTypes from "prop-types";
import {DisableButton, PresetColorButton, CustomColorButton, RadioButton,TextureButton, DownloadButton} from "./buttons"
import Material from "./material"

import BodyEditor from "./body-editor"
import HeadEditor from "./head-editor"
import ShirtEditor from "./shirt-editor"
import JacketEditor from "./jacket-editor"

import body from "../../includes/icons/icons_body.png"
import head from "../../includes/icons/icons_head.png"
import shirt from "../../includes/icons/icons_shirt.png"
import jacket from "../../includes/icons/icons_jacket.png"

import "../stylesheets/editor"

export class Editor extends Component{
    static propTypes = {
        models : PropTypes.object,
        model : PropTypes.object
    }

    constructor(props) {
        super(props);

        this.materials = [];

        this.bodyType = 'straight';
        this.hairType = 'long';

        this.body = React.createRef();
        this.head = React.createRef();
        this.shirt = React.createRef();
        this.jacket = React.createRef();

    }

    createMaterials(model, materials) {
        model.material = [];
        model.geometry.clearGroups();

        for (var i=0; i<materials.length; i++) {
            model.geometry.addGroup(0, Infinity, i);
            model.material.push(materials[i].material);
        }
    }
    
    componentDidMount() {
        const currentModel = this.props.models[this.bodyType][this.hairType].model;
        const bgMaterial = currentModel.material.clone();
        this.materials = [
            new Material(bgMaterial, "", null),
            ...this.body.current.materials,
            ...this.head.current.materials,
            ...this.shirt.current.materials,
            //...this.jacket.current.materials,
        ]
        
        Object.keys(this.props.models).forEach((b) => {
            Object.keys(this.props.models[b]).forEach((h) => {
                this.createMaterials(this.props.models[b][h].model, this.materials);
            })
        });

        this.props.models[this.bodyType][this.hairType].model.visible = true;

        this.changePage("Body")
    }

    changePage(value) {
        this.body.current.editorPage.current.setActive(value === "Body");
        this.head.current.editorPage.current.setActive(value === "Head");
        this.shirt.current.editorPage.current.setActive(value === "Shirt");
        this.jacket.current.editorPage.current.setActive(value === "Jacket");
    }

    updateHairType(hairType) {
        this.props.models[this.bodyType][this.hairType].model.visible = false;
        this.props.models[this.bodyType][hairType].model.visible = true;
        this.hairType = hairType;
    }

    updateBodyType(bodyType) {
        this.props.models[this.bodyType][this.hairType].model.visible = false;
        this.props.models[bodyType][this.hairType].model.visible = true;
        this.bodyType = bodyType;
    }

    getDownloadTexture() {
        const canvas = window.document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;

        const ctx = canvas.getContext("2d");

        this.materials.forEach(mat => {
            ctx.drawImage(mat.getDownloadTexture(), 0, 0);
        });

        new THREE.ImageLoader().load(canvas.toDataURL("image/png", 1.0), img => {
            const el = document.createElement("a");
            el.href = img.src;
            el.download = "tex.png";
            el.click();
            el.remove();
        })       
    }

    render() {
        const activeModel = this.props.models[this.bodyType][this.hairType].model;
        return(
        <>
            <div id="pageButtons">
                <TextureButton value="Body" defaultChecked={true} name="page" onChange={(e) => this.changePage(e.target.value)} src={body}/>
                <TextureButton value="Head"  name="page" onChange={(e) => this.changePage(e.target.value)} src={head}/>
                <TextureButton value="Shirt"  name="page" onChange={(e) => this.changePage(e.target.value)} src={shirt}/>
                <TextureButton value="Jacket"  name="page" onChange={(e) => this.changePage(e.target.value)} src={jacket}/>
                
            </div>
            <BodyEditor ref={this.body} model={activeModel} onChange={(b) => this.updateBodyType(b)}/>
            <HeadEditor ref={this.head} model={activeModel} onChange={(h) => this.updateHairType(h)}/>
            <ShirtEditor ref={this.shirt} model={activeModel} />
            <JacketEditor ref={this.jacket} model={activeModel} />
            <button onClick={e => this.getDownloadTexture(e)}>Download Texture</button>
        </>
        );
    }

}