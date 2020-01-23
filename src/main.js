import {TextureGroup, SimpleModelPart, ComplexModelPart} from './texture-group'
import * as THREE from "three";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as React from 'react';

import * as ReactDOM from 'react-dom';
import {ColorPicker} from './components/color-picker';
import { TextureLayer } from './components/texture-layer';
import { TextureGroup2 } from './components/texture-group';

import { ShaderMaterial, Object3D, SkinnedMesh, BufferGeometry, Vector3 } from 'three';

const TEXTURES = "../includes/textures/";

function getBodyPart(body, part ) {
    return body.getObjectByName(part);
}

async function init() {
    
    const size = {
        width : 500,
        height : 400
    }

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, size.width / size.height, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();

    renderer.setSize( size.width, size.height );
    document.getElementById('container').appendChild( renderer.domElement );



	// ambient
	scene.add( new THREE.AmbientLight( 0xffffff ) );
	
	// light
    camera.position.set( 0, 15, 20 );

	// textures
	var loader = new THREE.TextureLoader();
	
    var _loader = new GLTFLoader();

    await _loader.load('../includes/models/separated/hubs_model_short_messy.glb', (avatargltf)=> {
        avatargltf.scene.scale.x = 30;
        avatargltf.scene.scale.y = 30;
        avatargltf.scene.scale.z = 30;
        console.log(avatargltf.scene)
        avatargltf.scene.traverse((node) => {
            if(node.name == 'Body') {
                
                ReactDOM.render(
                    <TextureGroup2 model={node}>
                        <TextureLayer  material={node.material.clone()} />
                        <TextureLayer label='Hair' material={node.material.clone()} path={TEXTURES+'hair/'} filenames={['white']}/>
                        <TextureLayer label='Eyebrows' material={node.material.clone()} path={TEXTURES+'eyebrows/'} filenames={['white']}/>
                        <TextureLayer label='Eyes' material={node.material.clone()} path={TEXTURES+'eyes/'} filenames={['custom','default']}/>
                        <TextureLayer label='Shirt' material={node.material.clone()} path={TEXTURES+'shirt/'} filenames={['white']}/>
                        <TextureLayer label='Jacket' material={node.material.clone()} path={TEXTURES+'jacket/'} filenames={['white']}/>
                    </TextureGroup2>
                    , document.getElementById('testreact'))

                scene.add(avatargltf.scene);
                
            }
        })
        
        
        setInterval(() => {
            render();
        }, 100);
    });

    
    function render() {
        renderer.render( scene, camera );
    
    }
/*
    // @ts-ignore
    let body : THREE.Object3D = document.querySelector("#me").getObject3D('mesh');
    
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
            <ColorPicker label='Shirt' func={(clr)=>top_textures.updateTint(clr)} defaultColor='#00ffff'/>
            <ColorPicker label='Jacket' func={(clr)=>jacket_textures.updateTint(clr)} defaultColor='#0000ff'/>
            <ColorPicker label='Hair' func={(clr)=>hair_part.updateTint(clr)} defaultColor='#00ffff'/>
            <ColorPicker label='Eyebrows' func={(clr)=>eyebrows_part.updateTint(clr)} defaultColor='#00ffff'/>
            <ColorPicker label='Eyes' func={(clr)=>eyes_part.updateTint(clr)} defaultColor='#00ffff'/>
        </div>,
        document.getElementById('testreact')
    );*/
}


window.onload = init;