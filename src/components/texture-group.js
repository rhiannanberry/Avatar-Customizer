import * as THREE from "three";
import React, {Component} from "react";
import * as ReactDOM from 'react-dom';

import {TextureLayer} from './texture-layer';


export class TextureGroup2 extends Component{
    constructor(props) { //model, children
        super(props);

        let len = this.props.children.length;

        this.props.model.geometry.clearGroups();
        this.props.model.material = [];

        for(let i=0; i < len; i++) {
            this.props.model.geometry.addGroup(0, Infinity, i);
            this.props.model.material.push(this.props.children[i].props.material);
        }
    }

    getDownloadTexture(e) {
        let canvas = window.document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        
        let ctx = canvas.getContext('2d');
        this.refs.forEach(layer => {
            ctx.drawImage(layer.getDownloadTexture(),0,0);
        });
        
        let loader = new THREE.ImageLoader();
        loader.load(canvas.toDataURL('image/png', 1.0), (img) => {
            let el = document.createElement('a');
            el.href=img.src;
            el.download='tex.png';
            el.click();
            el.remove();
        })
    }

    randomize() {
        this.refs.forEach(layer => {
            layer.randomize();
        })
    }

    render() {
        this.children = React.Children.map(this.props.children, child => {
            this.refs = [];
            return React.cloneElement(child,{ref : el => this.refs.push(el) } )
        })
        return (
            <div>
                {this.children}
                <button onClick={(e)=>this.randomize(e)}>Randomize</button>
                <button onClick={(e)=>this.getDownloadTexture(e)}>Download Texture</button>
            </div>
        );
    }
}