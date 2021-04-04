import * as THREE from 'three';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { loadGLTF } from './util';

import AvatarBase from './models/avatar_base';
import AvatarPart from './models/avatar_part';

import Editor from './components/editor';
import ExportButton from './components/export_buttons';

import bodyModel from '../includes/models/merged/model_body.glb';
import hairModel from '../includes/models/merged/model_hair.glb';

import './stylesheets/main.scss';
import './stylesheets/buttons.scss';
import './stylesheets/editor.scss';


interface SceneObjects {
    camera: THREE.Camera;
    renderer: THREE.Renderer;
    scene: THREE.Scene;
    clock?: THREE.Clock;
}

function initializeScene(): SceneObjects {
    // setup scene

    const size = {
        width: 500,
        height: 400,
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const clock = new THREE.Clock();
    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setSize(size.width, size.height);
    controls.enablePan = false;

    // add renderer to dom
    document.getElementById('container').prepend(renderer.domElement);

    // add lighting and position camera
    // TODO: make scene bg configurable. at least light/dark toggle
    scene.add(new THREE.AmbientLight(0xffffff));
    scene.background = new THREE.Color(0x413b45);

    camera.position.set(0, 15, 20);
    camera.matrixAutoUpdate = true;

    controls.target.set(0, 15, 0);
    controls.update();

    return {
        camera: camera,
        clock: clock,
        renderer: renderer,
        scene: scene,
    };
}

async function importModels(): Promise<THREE.Group> {
    const bodyGLTF = await loadGLTF(bodyModel);
    const hairGLTF = await loadGLTF(hairModel);

    // process for export
    const scene = bodyGLTF.scene;
    const avatarRoot = scene.children[0];

    scene.scale.x = 30;
    scene.scale.y = 30;
    scene.scale.z = 30;

    const skeleton = (avatarRoot.children[1] as THREE.SkinnedMesh).skeleton;
    const bodySkinnedMeshes = avatarRoot.children.slice(1) as THREE.SkinnedMesh[];
    const hairSkinnedMeshes = hairGLTF.scene.children[0].children.slice(1) as THREE.SkinnedMesh[];

    // remove children from avatarRoot
    avatarRoot.children.splice(1, avatarRoot.children.length - 1);

    const avatarBase = new AvatarBase(bodyGLTF, skeleton);
    const bodyPart = new AvatarPart(true, true, bodySkinnedMeshes);
    const hairPart = new AvatarPart(false, true, hairSkinnedMeshes);

    avatarBase.addAvatarPart(bodyPart);
    avatarBase.addAvatarPart(hairPart);

    // ... just gonna put the react entry point here.... nbd >_>
    ReactDOM.render(
        <>
            <Editor bodyPart={bodyPart} hairPart={hairPart}></Editor>
            <ExportButton avatarBase={avatarBase} />
            <ExportButton avatarBase={avatarBase} texture />
        </>,
        document.getElementById('options'),
    );

    return scene;
}

function render(s: SceneObjects): void {
    s.renderer.render(s.scene, s.camera);
}

function initialize(): void {
    importModels().then(group => {
        const sceneObjects = initializeScene();
        sceneObjects.scene.add(group);

        setInterval(() => {
            render(sceneObjects);
        }, 100);
    });
}

window.onload = initialize;
