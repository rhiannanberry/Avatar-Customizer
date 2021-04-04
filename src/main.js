import * as THREE from "three";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter"
import styles from "./stylesheets/main.scss";
import buttonStyle from "./stylesheets/buttons.scss";
import editorStyle from "./stylesheets/editor.scss";

import Editor from "./components/editor";

import bdy from "../includes/models/merged/model_body.glb"
import hr from "../includes/models/merged/model_hair.glb"

import AvatarBase from "./models/avatar_base";
import AvatarPart from "./models/avatar_part";

var mixer= null;
var clock = new THREE.Clock();

function applyExtenstions() {
  THREE.Color.prototype.getHexStringFull = function getHexStringFull() {
    return "#" + this.getHexString();
  };

  THREE.Color.prototype.randomize = function randomize() {
    this.setHex(Math.random() * 0xffffff);
    return this;
  };
  THREE.Color.prototype.createRandom = function createRandomColor() {
    return new THREE.Color().randomize();
  };
}

async function init() {
  applyExtenstions();

  const size = {
    width: 500,
    height: 400
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(size.width, size.height);
  document.getElementById("container").prepend(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;

  // ambient
  scene.add(new THREE.AmbientLight(0xffffff));
  scene.background = new THREE.Color(0x413b45);

  // light
  camera.position.set(0, 15, 20);
  camera.matrixAutoUpdate = true;

  controls.target.set(0, 15, 0);
  controls.update();

  function render() {
    var delta = clock.getDelta();
    mixer.update(delta);
    renderer.render(scene, camera);
  }
  
  const bodyScene = await load(bdy);
  const hairScene = await load(hr);

  const sc = bodyScene.scene;
  const avatarRoot = bodyScene.scene.children[0];

  sc.scale.x = 30;
  sc.scale.y = 30;
  sc.scale.z = 30;
  //TODO: actually scour the whole model for extensions and delete, then re-add in correct spot
  // OR fix model. idk.
  //TODO: make little editor for adding gltf extensions easily
  if (avatarRoot.userData.gltfExtensions) {
    delete avatarRoot.userData.gltfExtensions.MOZ_hubs_components['scale-audio-feedback'];
  }
  avatarRoot.traverse(node => {
    if (node.name == "Neck") {
      node.userData.gltfExtensions= {
        MOZ_hubs_components: {
          version:4, 
          "scale-audio-feedback": {
            maxScale: 1.5,
            minScale: 1
          }
        }
      }
    }
  })
  const skeleton = avatarRoot.children[1].skeleton;
  const bodySkinnedMeshes = avatarRoot.children.slice(1);
  
  avatarRoot.children.splice(1, avatarRoot.children.length - 1);
  const avatarBase = new AvatarBase(bodyScene, skeleton);
  const avatarPart = new AvatarPart(true, true, bodySkinnedMeshes);
  avatarBase.addAvatarPart(avatarPart);

  const hairSkinnedMeshes = hairScene.scene.children[0].children.slice(1);

  const hairPart = new AvatarPart(false,true, hairSkinnedMeshes);
  avatarBase.addAvatarPart(hairPart);

  mixer = new THREE.AnimationMixer(sc);
  //const action = mixer.clipAction(bodyScene.animations[13])
  //action.play();
  scene.add(sc);

  function exportGLB() {
    const exporter = new GLTFExporter();
    avatarBase.getMergedGLTF().then(val => {
      exporter.parse(val.scene, (glb) => {
        avatarBase.postExportRestore();
        const blob = new Blob([glb], {type: 'model/gltf-binary'});
        const el = document.createElement("a");
        el.style.display = "none";
        el.href = URL.createObjectURL(blob);
        el.download = "custom_avatar.glb"
        el.click();
        el.remove();
      }, {animations: val.animations, binary: true, includeCustomExtensions: true})
    
    })
  }
  
  ReactDOM.render(
    <>
    <Editor bodyPart={avatarPart} hairPart={hairPart}></Editor>
    <button onClick={exportGLB}>EXPORT</button>
    </>,
    document.getElementById("options")
    )
    
  setInterval(() => {
    render();
  }, 100);
}

window.onload = init;


function load(src) {
  return new Promise((resolve, reject) => {
      const _loader = new GLTFLoader();
      _loader.load(
          src,
          (val) => {
              resolve(val);
          },
          undefined,
          (err) => {
              reject(err);
          }
      )
  })
}