import {TextureGroup, SimpleModelPart} from './texture-group'
import * as THREE from "three";

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ColorPicker} from './components/ColorPicker'
import { ShaderMaterial, Object3D, SkinnedMesh, BufferGeometry } from 'three';

const TEXTURES : string = "../includes/textures/";

function frag() {
    return `
    precision mediump float;
    uniform vec3 color;
    uniform float opacity;

    void main () {
        gl_FragColor = vec4(color, opacity);
    }
    `
}

function vert() {
    return `
    varying vec2 vUv;

    void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `
}

function sleep(ms:number) {
    return new Promise(resolve=> setTimeout(resolve,ms));
}

async function until(fn:any) {
    while(!fn()) {
        await sleep(0);
    }
}

function getBodyPart(body : THREE.Object3D, part : string) : any {
    return body.getObjectByName(part);
}


async function init() {

    // @ts-ignore
    let body : THREE.Object3D = document.querySelector("#me").getObject3D('mesh');

    let test = new TextureGroup(TEXTURES+'jacket/', ['white']);

    await until(() => {
        console.log(test.loaded);
        return test.loaded == true;})
    console.log('kdkkdkd');
    test._tint = '#fff000';
    test.getTexture().then( (tex) => {
        console.log(tex);
        console.log(tex);
    });
    
    console.log(body);
    let top : SkinnedMesh = getBodyPart(body, 'Top');
    let hair : SkinnedMesh = getBodyPart(body, 'Hair');
    let eyebrows : SkinnedMesh = getBodyPart(body, 'Eyebrows');
    let skin : SkinnedMesh = getBodyPart(body, 'Skin');
    let whites : SkinnedMesh = getBodyPart(body, 'Whites');
    let eyes : SkinnedMesh = getBodyPart(body, 'Eyes');
    
    
    //BUG: This changes something with aframes rendering, which in turn calls a 
    // deprecated function in threejs. Not currently in a state of mind to fix this! :"(  
        // @ts-ignore
    console.log(document.querySelector("#me").sceneEl.renderer);
    // @ts-ignore
    let jacket = new SkinnedMesh(top.geometry, top.material.clone());
    // @ts-ignore
    jacket.material.map = jacket.material.map.clone();
    jacket.bind(top.skeleton, top.bindMatrix);
    body.add(jacket);
    

        let jacket_part = new SimpleModelPart(jacket.material, TEXTURES + 'jacket/', ['white']);
        let shirt_part = new SimpleModelPart(top.material, TEXTURES + 'shirt/', ['white']);
        let hair_part = new SimpleModelPart(hair.material, TEXTURES + 'hair/', ['white']);
        let eyebrows_part = new SimpleModelPart(eyebrows.material, TEXTURES + 'eyebrows/', ['white']);
        let skin_part = new SimpleModelPart(skin.material, TEXTURES + 'skin/', ['6-n']);
        

    
        ReactDOM.render(
            <div>
                <ColorPicker func={(clr)=>shirt_part.updateTint(clr)} color='#00ffff'/>
                <ColorPicker func={(clr)=>jacket_part.updateTint(clr)} color='#00ffff'/>
                <ColorPicker func={(clr)=>hair_part.updateTint(clr)} color='#00ffff'/>
                <ColorPicker func={(clr)=>eyebrows_part.updateTint(clr)} color='#00ffff'/>
            </div>,
            document.getElementById('testreact')
        );
}


window.onload = init;