import {TextureGroup, SimpleModelPart, ComplexModelPart} from './texture-group'
import * as THREE from "three";
import {until} from "./util";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ColorPicker} from './components/ColorPicker'
import { ShaderMaterial, Object3D, SkinnedMesh, BufferGeometry } from 'three';

const TEXTURES : string = "../includes/textures/";

function getBodyPart(body : THREE.Object3D, part : string) : any {
    return body.getObjectByName(part);
}

async function init() {

    // @ts-ignore
    let body : THREE.Object3D = document.querySelector("#me").getObject3D('mesh');

    
    console.log(body);
    let top : SkinnedMesh = getBodyPart(body, 'Top');
    let hair : SkinnedMesh = getBodyPart(body, 'Hair');
    let eyebrows : SkinnedMesh = getBodyPart(body, 'Eyebrows');
    let skin : SkinnedMesh = getBodyPart(body, 'Skin');
    let whites : SkinnedMesh = getBodyPart(body, 'Whites');
    let eyes : SkinnedMesh = getBodyPart(body, 'Eyes');
    
    //BUG: This changes something with aframes rendering, which in turn calls a 
    // deprecated function in threejs. Not currently in a state of mind to fix this! :"(  
    let renderer = document.querySelector("#me").sceneEl.renderer;

    let top_textures = new TextureGroup(TEXTURES+'shirt/', ['white']);
    let jacket_textures = new TextureGroup(TEXTURES+'jacket/', ['white']);

    let top_part = new ComplexModelPart(renderer, top.material, [top_textures, jacket_textures]);
    

    //let jacket_part = new SimpleModelPart(jacket.material, TEXTURES + 'jacket/', ['white']);
    //let shirt_part = new SimpleModelPart(top.material, TEXTURES + 'shirt/', ['white']);
    let hair_part = new SimpleModelPart(hair.material, TEXTURES + 'hair/', ['white']);
    let eyebrows_part = new SimpleModelPart(eyebrows.material, TEXTURES + 'eyebrows/', ['white']);
    let skin_part = new SimpleModelPart(skin.material, TEXTURES + 'skin/', ['6-n']);
    let eyes_part = new SimpleModelPart(eyes.material, TEXTURES + 'eyes/', ['custom', 'default']);
    


    ReactDOM.render(
        <div>
            <ColorPicker label='Shirt' func={(clr)=>top_part.updateTint(0,clr)} color='#00ffff'/>
            <ColorPicker label='Jacket' func={(clr)=>top_part.updateTint(1,clr)} color='#0000ff'/>
            <ColorPicker label='Hair' func={(clr)=>hair_part.updateTint(clr)} color='#00ffff'/>
            <ColorPicker label='Eyebrows' func={(clr)=>eyebrows_part.updateTint(clr)} color='#00ffff'/>
            <ColorPicker label='Eyes' func={(clr)=>eyes_part.updateTint(clr)} color='#00ffff'/>
        </div>,
        document.getElementById('testreact')
    );
}


window.onload = init;