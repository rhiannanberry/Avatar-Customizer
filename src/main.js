import * as THREE from "three";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextureLayer } from "./components/texture-layer";
import styles from "./stylesheets/main.scss";
import { TextureGroup } from "./components/texture-group";
import gb from "../includes/models/separated/hubs_model_short_messy.glb";
import { LabeledTexture } from "./labeled-texture";

import skin from "../includes/textures/skin_default.png";
import blush from "../includes/textures/blush_default.png";
import eyes from "../includes/textures/eyes_default.png";
import eyes_black from "../includes/textures/eyes_black.png";
import eyebrows from "../includes/textures/eyebrows_default.png";
import jacket from "../includes/textures/jacket_default.png";
import shirt from "../includes/textures/shirt_default.png";
import hair from "../includes/textures/hair_default.png";

import skinLayout from "../includes/textures/layouts/skin_layout.png";
import topLayout from "../includes/textures/layouts/top_layout.png";
import eyebrowsLayout from "../includes/textures/layouts/eyebrows_layout.png";
import eyesLayout from "../includes/textures/layouts/eyes_layout.png";
import hairLayout from "../includes/textures/layouts/hair_layout.png";

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

  await _loader.load(
    gb,
    avatargltf => {
      avatargltf.scene.scale.x = 30;
      avatargltf.scene.scale.y = 30;
      avatargltf.scene.scale.z = 30;
      avatargltf.scene.traverse(node => {
        if (node.name == "Body") {
          ReactDOM.render(
            <TextureGroup model={node} id="options">
              <TextureLayer hidden={true} material={node.material.clone()} />
              <TextureLayer
                label="Skin"
                material={node.material.clone()}
                labeledTextures={[new LabeledTexture(skin)]}
                layoutTexture={new LabeledTexture(skinLayout, "", true)}
              />
              <TextureLayer
                label="Blush"
                material={node.material.clone()}
                labeledTextures={[new LabeledTexture(blush)]}
                layoutTexture={new LabeledTexture(skinLayout, "", true)}
                canDisable={true}
              />
              <TextureLayer
                label="Hair"
                material={node.material.clone()}
                labeledTextures={[new LabeledTexture(hair)]}
                layoutTexture={new LabeledTexture(hairLayout, "", true)}
              />
              <TextureLayer
                label="Eyebrows"
                material={node.material.clone()}
                labeledTextures={[new LabeledTexture(eyebrows)]}
                layoutTexture={new LabeledTexture(eyebrowsLayout, "", true)}
              />
              <TextureLayer
                label="Eyes"
                material={node.material.clone()}
                labeledTextures={[new LabeledTexture(eyes), new LabeledTexture(eyes_black, "Black")]}
                layoutTexture={new LabeledTexture(eyesLayout, "", true)}
              />
              <TextureLayer
                label="Shirt"
                material={node.material.clone()}
                labeledTextures={[new LabeledTexture(shirt)]}
                layoutTexture={new LabeledTexture(topLayout, "", true)}
              />
              <TextureLayer
                label="Shirt Logo"
                material={node.material.clone()}
                labeledTextures={[new LabeledTexture(shirt)]}
                layoutTexture={new LabeledTexture(topLayout, "", true)}
                canDisable={true}
                active={false}
              />
              <TextureLayer
                label="Jacket"
                material={node.material.clone()}
                labeledTextures={[new LabeledTexture(jacket)]}
                layoutTexture={new LabeledTexture(topLayout, "", true)}
                canDisable={true}
              />
              <TextureLayer
                label="Jacket Logo"
                material={node.material.clone()}
                labeledTextures={[new LabeledTexture(jacket)]}
                layoutTexture={new LabeledTexture(topLayout, "", true)}
                canDisable={true}
                active={false}
              />
            </TextureGroup>,
            document.getElementById("options")
          );

          scene.add(avatargltf.scene);
        }
      });

      setInterval(() => {
        render();
      }, 100);
    },
    undefined,
    e => {
      console.log(e);
    }
  );
}

window.onload = init;
