import * as THREE from "three";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { cloneDeep } from "lodash";
import AvatarPart from "./avatar_part";
import { Material } from "./materials/material";

export default class AvatarBase {
    private fullScene: Object;
    private skeleton: THREE.Skeleton;
    private materials: Material[];
    private avatarParts: AvatarPart[] = [];

    constructor(fullScene: Object, skeleton: THREE.Skeleton) { //should be a scene with "avatar root"
        this.fullScene = fullScene;
        this.skeleton = skeleton;
    }

    addAvatarPart(avatarPart: AvatarPart) {
        avatarPart.assignSkeleton(this.skeleton); //TODO: Figure out why this is insane
        this.avatarParts.push(avatarPart);
        console.log(this.avatarRoot)
        avatarPart.meshes.forEach((mesh) => {
            this.avatarRoot.add(mesh);
        })
    }

    async getMergedGLTF() {
        const material = await this.getMergedMaterial();
        let geometries:THREE.BufferGeometry[] = [];
        this.avatarParts.forEach(part => {
            geometries = geometries.concat(part.getSelectedMeshes().map(mesh => mesh.geometry));
        });

        const skinnedMesh = new THREE.SkinnedMesh(BufferGeometryUtils.mergeBufferGeometries(geometries), material);
        skinnedMesh.bind(this.skeleton);
        skinnedMesh.name = "Avatar";
        
        //TODO: Make sure this isn;t fucking up the skeleton attachment
        const fullSceneExport = cloneDeep(this.fullScene);

        //@ts-ignore
        let sceneObjects = fullSceneExport.scene.children[0].children;

        sceneObjects.splice(1, sceneObjects.length - 1);
        //@ts-ignore
        fullSceneExport.scene.children.push(skinnedMesh);
        return fullSceneExport;
    }

    private async getMergedMaterial() {
        let texture = await load(this.getMergedTexture());
        const mergedMaterial = new THREE.MeshStandardMaterial({map: texture as THREE.Texture});
        mergedMaterial.map.flipY = false;
        return mergedMaterial;
    }

    getMergedTexture() : string {
        const canvas = window.document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;

        const ctx = canvas.getContext("2d");
        this.materials.forEach( material => {
            ctx.drawImage(material.getFlattenedTexture(), 0, 0);
        });
        return canvas.toDataURL("image/png", 1.0);
    }

    get avatarRoot() {
        // @ts-ignore
        return this.fullScene.scene.children[0];
    }
}
function load(src : string) {
    return new Promise((resolve, reject) => {
        const _loader = new THREE.TextureLoader();
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