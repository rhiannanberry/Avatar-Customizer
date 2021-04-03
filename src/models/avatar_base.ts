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
    private avatarRootChildren: THREE.Object3D[];

    constructor(fullScene: Object, skeleton: THREE.Skeleton) { //should be a scene with "avatar root"
        this.fullScene = fullScene;
        this.skeleton = skeleton;
    }

    addAvatarPart(avatarPart: AvatarPart) {
        //avatarPart.assignSkeleton(this.skeleton); //TODO: Figure out why this is insane
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
        skinnedMesh.skeleton = this.skeleton;
        skinnedMesh.name = "Avatar";

        //@ts-ignore
        const sc = this.fullScene.scene as THREE.Scene;
        sc.scale.x = 1;
        sc.scale.y = 1;
        sc.scale.z = 1;

        const avatarRoot = sc.children[0];

        this.avatarRootChildren = avatarRoot.children.map(child => child);

        const bones = avatarRoot.children[0];
        const p1 = avatarRoot.children[1];
/*
        skinnedMesh.position.x = p1.position.x;
        skinnedMesh.position.y = p1.position.y;
        skinnedMesh.position.z = p1.position.z;
*/
        avatarRoot.remove(...avatarRoot.children);

        avatarRoot.add(bones);
        avatarRoot.add(skinnedMesh)
        console.log(sc);
        //@ts-ignore
        return this.fullScene;
    }

    private async getMergedMaterial() {
        let texture = await load(this.getMergedTexture());
        const mergedMaterial = new THREE.MeshStandardMaterial({map: texture as THREE.Texture});
        mergedMaterial.map.flipY = false;
        return mergedMaterial;
    }

    postExportRestore() {
        //@ts-ignore
        const sc = this.fullScene.scene as THREE.Scene;
        sc.scale.x = 30;
        sc.scale.y = 30;
        sc.scale.z = 30;
        this.avatarRoot.remove(...this.avatarRoot.children);
        this.avatarRootChildren.forEach(child => {
            this.avatarRoot.add(child);
        })
    }

    getMergedTexture() : string {
        const canvas = window.document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;

        const ctx = canvas.getContext("2d");
        this.avatarParts.forEach( avatarPart => {
            avatarPart.materials.forEach( material => {
                if (material.material.visible) {
                    ctx.drawImage(material.getFlattenedTexture(), 0, 0);
                }
            })
        });
        /*this.materials.forEach( material => {
            ctx.drawImage(material.getFlattenedTexture(), 0, 0);
        });*/
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