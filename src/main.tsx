import {TextureGroup, ComplexModelPart, ModelPart} from './texture-group'
import * as THREE from "three";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ColorPicker} from './components/ColorPicker'

const TEXTURES : string = "../includes/textures/";


function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function until(fn:any) {
    while (!fn()) {
        await sleep(0)
    }
}

async function init() {
    // @ts-ignore
    let me : THREE.Object3D = document.querySelector("#me").getObject3D('mesh');
    console.log(me);

    let hair_tex = new TextureGroup(TEXTURES + 'hair/', ['Auburn','Black','Blair']);
    let shirt_tex = new TextureGroup(TEXTURES + 'shirt/', ['white']);
    let jacket_tex = new TextureGroup(TEXTURES + 'jacket/', ['white']);

    await until(() => hair_tex.loaded == true && shirt_tex.loaded==true && jacket_tex.loaded ==true);
    //shirt_tex.tint = '#000000';
    let top = new ComplexModelPart(me.getObjectByName('Top'), [shirt_tex,jacket_tex]);
    let hair = new ModelPart(me.getObjectByName('Hair'), hair_tex);


    //top.setTexture();
    hair.setTexture();

    function shirtTint(tint) {
        top.updateTint(0, tint);
        top.setTexture();
    }

    function jacketTint(tint) {
        top.updateTint(1, tint);
        top.setTexture();
    }

    ReactDOM.render(
    <ColorPicker func={jacketTint} color='#00ffff'/>, document.getElementById('testreact'));
}


window.onload = init;