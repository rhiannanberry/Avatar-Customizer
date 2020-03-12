import * as THREE from "three";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { cloneDeep } from "lodash"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "./stylesheets/main.scss";
//import gb from "../includes/models/separated/hubs_model_short_messy.glb";

const modelPath = "../includes/models/merged/model_";

const modelTypes = [
  {body : "straight", hair: "none"},
  {body : "straight", hair: "short"},
  {body : "straight", hair: "blair"},
  {body : "straight", hair: "long"},
  {body : "curvy", hair: "none"},
  {body : "curvy", hair: "short"},
  {body : "curvy", hair: "blair"},
  {body : "curvy", hair: "long"},
]

import straight_none from "../includes/models/merged/model_straight_none.glb";
import straight_short from "../includes/models/merged/model_straight_short.glb";
import straight_blair from "../includes/models/merged/model_straight_blair.glb";
import straight_long from "../includes/models/merged/model_straight_long.glb";
import curvy_none from "../includes/models/merged/model_curvy_none.glb";
import curvy_short from "../includes/models/merged/model_curvy_short.glb";
import curvy_blair from "../includes/models/merged/model_curvy_blair.glb";
import curvy_long from "../includes/models/merged/model_curvy_long.glb";

import {Editor} from "./components/editor"
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
    renderer.render(scene, camera);
  }

  
  const _loader = new GLTFLoader();
  
  var models = {}
  var cnt = 0;

  function processModel(src, bodyType, hair, val, success) {
    var mod = null;
    var fullscene = null;

    if (success) {
      fullscene = cloneDeep(val)

      val.scene.scale.x = 30;
      val.scene.scale.y = 30;
      val.scene.scale.z = 30;
      val.scene.traverse(node => {
        if (node.name == "Body") {
          
          mod = node
          mod.visible = false;
        }
      })
      scene.add(val.scene);
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

  
  modelTypes.forEach(model => {
    const src = `${modelPath}${model.body}_${model.hair}.glb`
    _loader.load( src,
                  (val) => {processModel(src, model.body, model.hair, val, true)},
                  undefined,
                  (val) => {processModel(src, model.body, model.hair, val, false)}
                );
  });

  await until(()=>{return cnt==8})
  ReactDOM.render(
    <>
    <Editor models={models}/>
    </>,
    document.getElementById("options")
  )

  setInterval(() => {
    render();
  }, 100);
}

window.onload = init;
