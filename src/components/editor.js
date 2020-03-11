import React, { Component } from "react";

import PropTypes from "prop-types";
import {DisableButton, PresetColorButton, CustomColorButton, RadioButton,TextureButton} from "./buttons"

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

        this.bodyType = 'curvy';
        this.hairType = 'long';

        this.body = React.createRef();
        this.head = React.createRef();
        this.shirt = React.createRef();
        this.jacket = React.createRef();

    }

    createMaterials(model, materials) {
        var counter = 0;
        const backgroundMaterial = model.material.clone();

        model.material = [];

        model.geometry.clearGroups();

        if (materials != null) {
            this.addMaterials(0, materials, model);
        } else {

            model.geometry.addGroup(0, Infinity, counter);
            model.material.push(backgroundMaterial);
    
            counter = this.addMaterials(1, this.body.current.materials,model);
            counter = this.addMaterials(counter, this.head.current.materials,model);
            counter = this.addMaterials(counter, this.shirt.current.materials,model);
            //counter = this.addMaterials(counter, this.jacket.current.materials);
        }

    }
    
    componentDidMount() {
        this.createMaterials(this.props.models[this.bodyType][this.hairType].model);
        this.props.models[this.bodyType][this.hairType].model.visible = true;
        var materialList = this.props.models[this.bodyType][this.hairType].model.material;

        this.changePage("Body")
    }

    addMaterials(counter, materials, model) {
        for (var i=0; i<materials.length; i++) {
            model.geometry.addGroup(0, Infinity, counter+i);
            model.material.push(materials[i].material);
        }
        return counter+materials.length;
    }

    changePage(value) {
        this.body.current.editorPage.current.setActive(value === "Body");
        this.head.current.editorPage.current.setActive(value === "Head");
        this.shirt.current.editorPage.current.setActive(value === "Shirt");
        this.jacket.current.editorPage.current.setActive(value === "Jacket");
    }

    render() {
        return(
        <>
            <div id="pageButtons">
                <TextureButton value="Body" defaultChecked={true} name="page" onChange={(e) => this.changePage(e.target.value)} src={body}/>
                <TextureButton value="Head"  name="page" onChange={(e) => this.changePage(e.target.value)} src={head}/>
                <TextureButton value="Shirt"  name="page" onChange={(e) => this.changePage(e.target.value)} src={shirt}/>
                <TextureButton value="Jacket"  name="page" onChange={(e) => this.changePage(e.target.value)} src={jacket}/>
                
            </div>
            <BodyEditor ref={this.body} model={this.props.models[this.bodyType][this.hairType].model} />
            <HeadEditor ref={this.head} model={this.props.models[this.bodyType][this.hairType].model} />
            <ShirtEditor ref={this.shirt} model={this.props.models[this.bodyType][this.hairType].model} />
            <JacketEditor ref={this.jacket} model={this.props.models[this.bodyType][this.hairType].model} />
        </>
        );
    }

}