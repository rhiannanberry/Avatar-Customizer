import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import { cloneDeep } from "lodash";

import body_glb from "../includes/models/merged/model_body.glb"
import hair_glb from "../includes/models/merged/model_hair.glb"

export default async function merge_models() {
    var body = await load(body_glb);
    var hair = await load(hair_glb);

    var base = cloneDeep(body)

    var base_meshes = base.scene.children[0].children;
    var hair_meshes = hair.scene.children[0].children;

    base_meshes.pop();

    console.log(base_meshes[1].geometry)

    base_meshes[1].geometry = BufferGeometryUtils.mergeBufferGeometries([base_meshes[1].geometry, hair_meshes[1].geometry])
    console.log(base_meshes)
}

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