import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import load from '../util';
import AvatarPart from './avatar_part';
import { Material } from './materials/material';

export default class AvatarBase {
    private fullScene: GLTF;
    private skeleton: THREE.Skeleton;
    private materials: Material[];
    private avatarParts: AvatarPart[] = [];
    private avatarRootChildren: THREE.Object3D[];

    constructor(fullScene: GLTF, skeleton: THREE.Skeleton) {
        //should be a scene with "avatar root"
        this.fullScene = fullScene;
        this.skeleton = skeleton;
    }

    addAvatarPart(avatarPart: AvatarPart): void {
        //avatarPart.assignSkeleton(this.skeleton); //TODO: Figure out why this is insane
        this.avatarParts.push(avatarPart);
        console.log(this.avatarRoot);
        avatarPart.meshes.forEach(mesh => {
            this.avatarRoot.add(mesh);
        });
    }

    async getMergedGLTF(): Promise<GLTF> {
        const material = await this.getMergedMaterial();
        let geometries: THREE.BufferGeometry[] = [];
        this.avatarParts.forEach(part => {
            geometries = geometries.concat(part.getSelectedMeshes().map(mesh => mesh.geometry));
        });

        const skinnedMesh = new THREE.SkinnedMesh(BufferGeometryUtils.mergeBufferGeometries(geometries), material);
        skinnedMesh.skeleton = this.skeleton;
        skinnedMesh.name = 'Avatar';

        const sc = this.fullScene.scene;
        sc.scale.x = 1;
        sc.scale.y = 1;
        sc.scale.z = 1;

        const avatarRoot = sc.children[0];
        this.avatarRootChildren = avatarRoot.children.map(child => child);
        const bones = avatarRoot.children[0];

        avatarRoot.remove(...avatarRoot.children);

        avatarRoot.add(bones);
        avatarRoot.add(skinnedMesh);
        console.log(sc);
        return this.fullScene;
    }

    private async getMergedMaterial(): Promise<THREE.MeshStandardMaterial> {
        const texture = await load(this.getMergedTexture());
        const mergedMaterial = new THREE.MeshStandardMaterial({ map: texture as THREE.Texture });
        mergedMaterial.map.flipY = false;
        return mergedMaterial;
    }

    postExportRestore(): void {
        const sc = this.fullScene.scene;
        sc.scale.x = 30;
        sc.scale.y = 30;
        sc.scale.z = 30;
        this.avatarRoot.remove(...this.avatarRoot.children);
        this.avatarRootChildren.forEach(child => {
            this.avatarRoot.add(child);
        });
    }

    getMergedTexture(): string {
        const canvas = window.document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;

        const ctx = canvas.getContext('2d');
        this.avatarParts.forEach(avatarPart => {
            avatarPart.materials.forEach(material => {
                if (material.material.visible) {
                    ctx.drawImage(material.getFlattenedTexture(), 0, 0);
                }
            });
        });
        return canvas.toDataURL('image/png', 1.0);
    }

    get avatarRoot(): THREE.Object3D {
        return this.fullScene.scene.children[0];
    }
}
