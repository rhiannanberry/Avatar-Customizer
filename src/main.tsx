import * as THREE from 'three';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { loadGLTF } from './util';

import AvatarBase from './models/avatar_base';
import AvatarPart from './models/avatar_part';

import Editor from './components/editor';
import ExportButton from './components/export_buttons';

import bodyModel from './includes/models/body2.glb';
import hairModel from './includes/models/hair.glb';
import hair2Model from './includes/models/hair_2.glb';
import headwearModel from './includes/models/headwear.glb';
import moustachesModel from './includes/models/moustaches.glb';
import beardsModel from './includes/models/beards.glb';
import glassesModel from './includes/models/glasses.glb';

import './stylesheets/main.scss';
import './stylesheets/buttons.scss';

interface SceneObjects {
    camera: THREE.Camera;
    renderer: THREE.Renderer;
    scene: THREE.Scene;
    clock?: THREE.Clock;
}

interface DynamicSceneObjects {
    group: THREE.Group;
    mixer: THREE.AnimationMixer;
}

function initializeScene(): SceneObjects {
    // setup scene

    const size = {
        width: 350,
        height: 450,
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const clock = new THREE.Clock();
    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setSize(size.width, size.height);
    renderer.domElement.setAttribute('aria-label', 'preview');
    controls.enablePan = false;

    // add renderer to dom
    document.getElementById('left').prepend(renderer.domElement);

    const marker = document.createElement('div');
    marker.setAttribute('id', 'site-marker');
    marker.innerHTML = 'qt-mkr';
    document.getElementById('left').prepend(marker);

    // add lighting and position camera
    // TODO: make scene bg configurable. at least light/dark toggle
    const light = new THREE.PointLight(0xffffff, 0.5, 100);
    light.position.set(6, 6, 10);
    scene.add(light);
    const light2 = new THREE.PointLight(0xffffff, 0.5, 100);
    light2.position.set(-6, 6, -6);
    scene.add(light2);
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    scene.background = new THREE.Color(0xe6e6e6);

    camera.position.set(0.2, 0.7, 0.65);
    camera.matrixAutoUpdate = true;

    controls.target.set(0, 0.5, 0);
    controls.update();

    return {
        camera: camera,
        clock: clock,
        renderer: renderer,
        scene: scene,
    };
}

async function importModels(): Promise<DynamicSceneObjects> {
    const bodyGLTF = await loadGLTF(bodyModel);
    const hairGLTF = await loadGLTF(hairModel);
    const hair2GLTF = await loadGLTF(hair2Model);
    const headwearGLTF = await loadGLTF(headwearModel);
    const moustachesGLTF = await loadGLTF(moustachesModel);
    const beardsGLTF = await loadGLTF(beardsModel);
    const glassesGLTF = await loadGLTF(glassesModel);

    // process for export
    const scene = bodyGLTF.scene;
    const avatarRoot = scene.children[0];

    const hipsIndex = avatarRoot.children.findIndex(e => e.type === 'Bone');
    const baseIndex = avatarRoot.children.findIndex(e => e.name === 'base');

    const skeleton = (avatarRoot.children[baseIndex] as THREE.SkinnedMesh).skeleton;
    const headHandsMesh = [avatarRoot.children[baseIndex] as THREE.SkinnedMesh];
    const bodySkinnedMeshes = avatarRoot.children.filter(
        e => e.name !== 'base' && e.type !== 'Bone',
    ) as THREE.SkinnedMesh[];
    const hairSkinnedMeshes = hairGLTF.scene.children[0].children.filter(e => e.type !== 'Bone') as THREE.SkinnedMesh[];
    const hair2SkinnedMeshes = hair2GLTF.scene.children[0].children.filter(
        e => e.type !== 'Bone',
    ) as THREE.SkinnedMesh[];
    const headwearSkinnedMeshes = headwearGLTF.scene.children[0].children.filter(
        e => e.type !== 'Bone',
    ) as THREE.SkinnedMesh[];
    const moustachesSkinnedMeshes = moustachesGLTF.scene.children[0].children.filter(
        e => e.type !== 'Bone',
    ) as THREE.SkinnedMesh[];
    const beardsSkinnedMeshes = beardsGLTF.scene.children[0].children.filter(
        e => e.type !== 'Bone',
    ) as THREE.SkinnedMesh[];
    const glassesSkinnedMeshes = glassesGLTF.scene.children[0].children.slice(1) as THREE.SkinnedMesh[];

    // remove children from avatarRoot
    avatarRoot.children = [avatarRoot.children[hipsIndex]];

    const avatarBase = new AvatarBase(bodyGLTF, skeleton);
    const headHandsPart = new AvatarPart(true, true, headHandsMesh);
    const bodyPart = new AvatarPart(true, true, bodySkinnedMeshes);
    const hairPart = new AvatarPart(false, true, hairSkinnedMeshes);
    const hair2Part = new AvatarPart(false, true, hair2SkinnedMeshes);
    const headwearPart = new AvatarPart(false, true, headwearSkinnedMeshes);
    const moustachesPart = new AvatarPart(false, true, moustachesSkinnedMeshes);
    const beardsPart = new AvatarPart(false, true, beardsSkinnedMeshes);
    const glassesPart = new AvatarPart(false, true, glassesSkinnedMeshes);

    avatarBase.addAvatarPart(headHandsPart);
    avatarBase.addAvatarPart(hairPart);
    avatarBase.addAvatarPart(hair2Part);
    avatarBase.addAvatarPart(bodyPart);
    avatarBase.addAvatarPart(glassesPart);
    avatarBase.addAvatarPart(headwearPart);
    avatarBase.addAvatarPart(moustachesPart);
    avatarBase.addAvatarPart(beardsPart);

    hairPart.assignSkeleton(skeleton);
    hair2Part.assignSkeleton(skeleton);
    glassesPart.assignSkeleton(skeleton);
    headwearPart.assignSkeleton(skeleton);
    moustachesPart.assignSkeleton(skeleton);
    beardsPart.assignSkeleton(skeleton);

    const mixer = new THREE.AnimationMixer(scene);
    mixer.clipAction(bodyGLTF.animations.find(anim => anim.name == 'idle_eyes')).play(); // idle animation

    // ... just gonna put the react entry point here.... nbd >_>
    ReactDOM.render(
        <>
            <ExportButton avatarBase={avatarBase} />
            <ExportButton avatarBase={avatarBase} texture />
        </>,
        document.getElementById('buttons'),
    );
    ReactDOM.render(
        <>
            <Editor
                basePart={headHandsPart}
                bodyPart={bodyPart}
                glassesPart={glassesPart}
                hairPart={hairPart}
                hair2Part={hair2Part}
                headwearPart={headwearPart}
                moustachesPart={moustachesPart}
                beardsPart={beardsPart}
            ></Editor>
        </>,
        document.getElementById('options'),
    );

    return { group: scene, mixer: mixer };
}

function render(s: SceneObjects, mixer: THREE.AnimationMixer): void {
    const delta = s.clock.getDelta();
    mixer.update(delta);
    s.renderer.render(s.scene, s.camera);
}

function initialize(): void {
    importModels().then(dso => {
        const sceneObjects = initializeScene();
        sceneObjects.scene.add(dso.group);

        setInterval(() => {
            render(sceneObjects, dso.mixer);
        }, 100);
    });
}

window.onload = initialize;
