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
    avatarParts: AvatarPart[] = [];
    private avatarRootChildren: THREE.Object3D[];

    constructor(fullScene: GLTF, skeleton: THREE.Skeleton) {
        this.fullScene = fullScene;
        this.skeleton = skeleton;
        //delete this.avatarRoot.userData;

        // TODO: WHY.... ISNT THE ANIMATION WORKING.....
        this.avatarRoot.userData = {
            name: 'AvatarRoot',
            gltfExtensions: {
                MOZ_hubs_components: {
                    'loop-animation': {
                        clip: 'idle_eyes',
                        paused: false,
                    },
                },
            },
        };

        this.avatarRoot.traverse(node => {
            if (node.name == 'Neck') {
                node.userData = {
                    gltfExtensions: {
                        MOZ_hubs_components: {
                            version: 4,
                            'scale-audio-feedback': {
                                maxScale: 1.5,
                                minScale: 1,
                            },
                        },
                    },
                };
            }
        });
    }

    addAvatarPart(avatarPart: AvatarPart): void {
        this.avatarParts.push(avatarPart);
        avatarPart.meshes.forEach(mesh => {
            this.avatarRoot.add(mesh);
        });
    }

    async getMergedGLTF(): Promise<GLTF> {
        const material = await this.getMergedMaterial();
        let geometries: THREE.BufferGeometry[] = [];
        this.avatarParts.forEach(part => {
            if (!part.disabled) {
                geometries = geometries.concat(part.getSelectedMeshes().map(mesh => mesh.geometry));
            }
        });
        const skinnedMesh = new THREE.SkinnedMesh(BufferGeometryUtils.mergeBufferGeometries(geometries), material);
        skinnedMesh.skeleton = this.skeleton;
        skinnedMesh.name = 'Avatar';

        const sc = this.fullScene.scene;

        const avatarRoot = sc.children[0];
        this.avatarRootChildren = avatarRoot.children.map(child => child);
        const bones = avatarRoot.children[0];

        avatarRoot.remove(...avatarRoot.children);

        avatarRoot.add(bones);
        avatarRoot.add(skinnedMesh);
        return this.fullScene;
    }

    private async getMergedMaterial(): Promise<THREE.MeshStandardMaterial> {
        const texture = await load(this.getMergedTexture());
        const mergedMaterial = new THREE.MeshStandardMaterial({ map: texture as THREE.Texture, skinning: true });
        mergedMaterial.map.flipY = false;
        return mergedMaterial;
    }

    postExportRestore(): void {
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
