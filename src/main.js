import * as THREE from "three";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { cloneDeep } from "lodash"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "./stylesheets/main.scss";
import merge_models from "./test_merge.js"

import ModelPart from "./model-part.js"

import BodyPage from "./components/editor-pages/body/body_v2";

import sn from "../includes/models/merged/model_straight_none.glb";
import ss from "../includes/models/merged/model_straight_short.glb";
import sb from "../includes/models/merged/model_straight_blair.glb";
import sl from "../includes/models/merged/model_straight_long.glb";
import cn from "../includes/models/merged/model_curvy_none.glb";
import cs from "../includes/models/merged/model_curvy_short.glb";
import cb from "../includes/models/merged/model_curvy_blair.glb";
import cl from "../includes/models/merged/model_curvy_long.glb";

import bdy from "../includes/models/merged/model_body.glb"
import hr from "../includes/models/merged/model_hair.glb"

import AvatarBase from "./models/avatar_base";
import AvatarPart from "./models/avatar_part";

const modelTypes = [
  {body : "straight", hair: "none", src: sn},
  {body : "straight", hair: "short", src: ss},
  {body : "straight", hair: "blair", src: sb},
  {body : "straight", hair: "long", src: sl},
  {body : "curvy", hair: "none", src: cn},
  {body : "curvy", hair: "short", src: cs},
  {body : "curvy", hair: "blair", src: cb },
  {body : "curvy", hair: "long", src: cl},
]
//LOOK INTO GLTF EXPORTER. You might be able to combine parts and skeletons and such, then export as one thing
const scaleAudio = {
  gltfExtensions: {
    MOZ_hubs_components: {
      "scale-audio-feedback": {
        maxScale: 1.25,
        minScale: 1
      }
    }
  }
}

var mixer= null;
var clock = new THREE.Clock();

var modelParts = {
  exportScene : {},
  body: {scene : null},
  hair: {scene : null}

}

let avatarPart = null;


import Editor from "./components/editor/editor";
import { until } from "./util";

const TEXTURES = "../includes/textures/";

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

  
  const _loader = new GLTFLoader();
  
  var models = {}
  var cnt = 0;

  function processModel(bodyType, hair, val, success) {
    var mod = null;
    var fullscene = null;

    if (success) {
      fullscene = cloneDeep(val)

      val.scene.scale.x = 30;
      val.scene.scale.y = 30;
      val.scene.scale.z = 30;

      fullscene.scene.traverse(node=> {
        if (node.name == "AvatarRoot") {
          delete node.userData.gltfExtensions.MOZ_hubs_components['scale-audio-feedback']
        }



        if (node.name == "Head") {
          node.userData = {...node.userData, ...scaleAudio}
        }
      })

      val.scene.traverse(node => {

        if (node.name == "Body") {
          //console.log(node.parent)
          mod = node
          mod.visible = false;
        }
      })
      if (cnt == 0) {
        mixer = new THREE.AnimationMixer(val.scene);
        
      }
      if (cnt == 1) {
        mixer.clipAction(THREE.AnimationClip.findByName(val.animations, "idle")).play()
      }
      //scene.add(val.scene);
    } else {
      console.log(val);
    }

    if (models[bodyType]) {
      models[bodyType][hair] = {model: mod, fullscene: fullscene}
    } else {
      models[bodyType] =  {[hair]: {model: mod, fullscene: fullscene}}
    }
    cnt+=1;
  }

  const bodyScene = await load(bdy);
  const hairScene = await load(hr);
  console.log(bodyScene)
  console.log(hairScene)
  const sc = bodyScene.scene;
  const avatarRoot = bodyScene.scene.children[0];
  const skeleton = avatarRoot.children[1].skeleton;
  const bodySkinnedMeshes = avatarRoot.children.slice(1);
  
  avatarRoot.children.splice(1, avatarRoot.children.length - 1);
  const avatarBase = new AvatarBase(bodyScene, skeleton);
  avatarPart = new AvatarPart(true, true, bodySkinnedMeshes);
  avatarBase.addAvatarPart(avatarPart);

  const hairSkinnedMeshes = hairScene.scene.children[0].children.slice(1);
 
  const hairPart = new AvatarPart(false,true, hairSkinnedMeshes);
  avatarBase.addAvatarPart(hairPart);

  sc.scale.x = 30;
  sc.scale.y = 30;
  sc.scale.z = 30;

  scene.add(sc);
  console.log(scene)

  modelTypes.forEach(model => {
    _loader.load( model.src,
                  (val) => {processModel(model.body, model.hair, val, true)},
                  undefined,
                  (val) => {processModel(model.body, model.hair, val, false)}
                );
  });

  const bod = await new ModelPart(bdy,scene,30)
  const har = await new ModelPart(hr,scene,30)
  
  await until(()=>{return cnt==8})
  
  ReactDOM.render(
    <>
    <BodyPage avatarPart={avatarPart} hairPart={hairPart}></BodyPage>
    </>,
    document.getElementById("options")
    )
    
    //<Editor models={models} modelParts={modelParts} body={bod} hair={har}/>
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