import React, { Component } from "react";
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
        materials : PropTypes.arrayOf(PropTypes.object)
    }

    constructor(props) {
      super(props);
      this.body = React.createRef();
      this.head = React.createRef();
      this.shirt = React.createRef();
      this.jacket = React.createRef();

      const len = this.props.materials.length;
      console.log(len)

    this.props.model.geometry.clearGroups();
    this.props.model.material = [];

    for (let i = 0; i < len; i++) {
      this.props.model.geometry.addGroup(0, Infinity, i);
      this.props.model.material.push(this.props.materials[i]);
    }

    }
    
    componentDidMount() {
        this.changePage("Body")
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
            <BodyEditor ref={this.body} />
            <HeadEditor ref={this.head} />
            <ShirtEditor ref={this.shirt} />
            <JacketEditor ref={this.jacket} />
        </>
        );
    }

}