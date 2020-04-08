import React, { Component } from "react";
import * as THREE from "three";
import {GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter"
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js"

import PropTypes from "prop-types";
import Material from "../material"
import Swatches from "../color-picker2"

import BodyEditor from "../editor-pages/body/body-editor"
import HeadEditor from "../editor-pages/head/head-editor"
import ShirtEditor from "../editor-pages/shirt/shirt-editor"

import body from "./icons_body.png"
import head from "./icons_head.png"
import shirt from "./icons_shirt.png"

import "../../stylesheets/editor"

const hairTypes = ["none", "short", "blair", "long"];
const bodyTypes = ["straight", "curvy"]

export default class Editor extends Component{
    static propTypes = {
        models : PropTypes.object,
        body: PropTypes.object,
        hair: PropTypes.object,
        model : PropTypes.object
    }

    constructor(props) {
        super(props);

        this.materials = [];

        this.bodyType = bodyTypes[Math.floor(Math.random() * Math.floor(bodyTypes.length))];
        this.hairType = hairTypes[Math.floor(Math.random() * Math.floor(hairTypes.length))];

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
        this.props.body.setMaterials(this.materials)
        this.props.hair.setMaterials(this.materials)
        this.props.models[this.bodyType][this.hairType].model.visible = true;

        this.changePage("Body")
    }

    changePage(value) {
        this.body.current.editorPage.current.setActive(value === "Body");
        this.head.current.editorPage.current.setActive(value === "Head");
        this.shirt.current.editorPage.current.setActive(value === "Shirt");
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

    getGLB() {
        const exporter = new GLTFExporter();
        const fullscene = this.props.models[this.bodyType][this.hairType].fullscene;
        var base = this.props.body.exportModel();
        var hairModel = this.props.hair.exportModel();
        base.scene.children[0].children[1].name = "Body";
        base.scene.children[0].children[1].geometry = BufferGeometryUtils.mergeBufferGeometries([base.scene.children[0].children[1].geometry, hairModel.scene.children[0].children[1].geometry],false)

        new THREE.TextureLoader().load(this.getMergedTextureURL(), (tex) => {
            fullscene.scene.traverse(node => {
                if (node.name == "Body") {
                    base.scene.children[0].children[1].material.map = tex;
                    base.scene.children[0].children[1].material.map.flipY = false;
                    node.material.map = tex;
                    node.material.map.flipY = false;
                }
            });

            exporter.parse(base.scene, (gltf) => {
                const blob = new Blob([gltf], {type: 'application/octet-stream'});
                const el = document.createElement("a");
                el.style.display = "none";
                el.href = URL.createObjectURL(blob);
                el.download = "custom_avatar.glb"
                el.click();
                el.remove();
    
            }, { animations: this.props.models[this.bodyType][this.hairType].fullscene.animations, binary:true})

        }, undefined, (e) => {console.log(e)})
    }

    getMergedTextureURL() {
        const canvas = window.document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;

        const ctx = canvas.getContext("2d");

        this.materials.forEach(mat => {
            ctx.drawImage(mat.getBakedTexture(), 0, 0);
        });

        return canvas.toDataURL("image/png", 1.0);

        return ( new Promise((resolve,reject) => {
            new THREE.ImageLoader().load(canvas.toDataURL("image/png", 1.0), resolve, undefined, reject)
        }
        ));    
    }

    downloadMergedTexture() {
        new THREE.ImageLoader().load(this.getMergedTextureURL(), (r) => {
            const el = document.createElement("a");
            el.href = r.src;
            el.download = "custom_avatar_texture.png";
            el.click();
            el.remove();
        }, undefined, undefined)
    }

    render() {
        const activeModel = this.props.models[this.bodyType][this.hairType].model;
        return(
        <>
            <div id="pageButtons">
                <Swatches
                    width={'60px'}
                    height={'60px'}
                    textures={[body,head,shirt]}
                    selected={body}
                    canDisable={false}
                    onChange={(src) => {
                        var loc = ""
                        switch(src) {
                            case body: loc = "Body"; break;
                            case head: loc = "Head"; break;
                            case shirt: loc = "Shirt"; break;
                        }
                        this.changePage(loc);
                    
                    }}
                />
                
                
            </div>
            <BodyEditor ref={this.body} model={activeModel} modelPart={this.props.body} onChange={(b) => this.updateBodyType(b)} selected={this.bodyType}/>
            <HeadEditor ref={this.head} model={activeModel} modelPart={this.props.hair} onChange={(h) => this.updateHairType(h)} selected={this.hairType}/>
            <ShirtEditor ref={this.shirt} model={activeModel} modelPart={this.props.body}/>
            <button onClick={e => this.downloadMergedTexture()}>Download Texture</button>
            <button onClick={e => this.getGLB(e)}>Download Model</button>
        </>
        );
    }

}