import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function load(src: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
        const _loader = new THREE.TextureLoader();
        _loader.load(
            src,
            val => {
                resolve(val);
            },
            undefined,
            err => {
                reject(err);
            },
        );
    });
}

export function loadGLTF(src: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
        const _loader = new GLTFLoader();
        _loader.load(
            src,
            val => {
                resolve(val);
            },
            undefined,
            err => {
                reject(err);
            },
        );
    });
}
