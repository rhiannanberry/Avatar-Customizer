import * as THREE from "three";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextureLayer } from "./components/texture-layer";
import { TextureGroup } from "./components/texture-group";

const TEXTURES = "../includes/textures/";

async function init() {
  const size = {
    width: 500,
    height: 400
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(size.width, size.height);
  document.getElementById("container").appendChild(renderer.domElement);
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

  await _loader.load("../includes/models/separated/hubs_model_short_messy.glb", avatargltf => {
    avatargltf.scene.scale.x = 30;
    avatargltf.scene.scale.y = 30;
    avatargltf.scene.scale.z = 30;
    avatargltf.scene.traverse(node => {
      if (node.name == "Body") {
        ReactDOM.render(
          <TextureGroup model={node}>
            <TextureLayer enableTint={false} material={node.material.clone()} />
            <TextureLayer
              label="Hair"
              material={node.material.clone()}
              path={TEXTURES + "hair/"}
              filenames={["white"]}
            />
            <TextureLayer
              label="Eyebrows"
              material={node.material.clone()}
              path={TEXTURES + "eyebrows/"}
              filenames={["white"]}
            />
            <TextureLayer
              disabled={true}
              label="Eyes"
              material={node.material.clone()}
              path={TEXTURES + "eyes/"}
              filenames={["custom", "default"]}
            />
            <TextureLayer
              label="Shirt"
              material={node.material.clone()}
              path={TEXTURES + "shirt/"}
              filenames={["white"]}
            />
            <TextureLayer
              label="Jacket"
              material={node.material.clone()}
              path={TEXTURES + "jacket/"}
              filenames={["white"]}
            />
          </TextureGroup>,
          document.getElementById("testreact")
        );

        scene.add(avatargltf.scene);
      }
    });

    setInterval(() => {
      render();
    }, 100);
  });
}

window.onload = init;
