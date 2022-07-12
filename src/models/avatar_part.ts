import * as THREE from 'three';
import { Material } from './materials/material';

export default class AvatarPart {
    isRequired: boolean;
    isSingular: boolean;
    //private sharesMaterials: Boolean = true;
    private selectedSkinnedMeshes: string[] = [];
    skinnedMeshes: THREE.SkinnedMesh[];
    materials: Material[];

    constructor(isRequired: boolean, isSingular: boolean, skinnedMeshes: THREE.SkinnedMesh[]) {
        this.isRequired = isRequired;
        this.isSingular = isSingular;
        this.skinnedMeshes = skinnedMeshes;
        if (this.isRequired) {
            this.selectedSkinnedMeshes.push(this.skinnedMeshes[0].name); //TODO: Maybe set this to random among sm
        }
        this.skinnedMeshes.forEach(mesh => {
            mesh.visible = this.isSelected(mesh.name);
        });
    }

    assignSkeleton(skeleton: THREE.Skeleton): void {
        this.skinnedMeshes.forEach(mesh => {
            mesh.skeleton?.dispose();
            mesh.skeleton = skeleton;
        });
    }

    assignNewMaterials(materials: Material[]): void {
        this.skinnedMeshes.forEach(mesh => {
            mesh.material = [];
            mesh.geometry.clearGroups();
            materials.forEach((material: Material, i: number) => {
                mesh.geometry.addGroup(0, Infinity, i);
                // @ts-ignore
                mesh.material.push(material.material);
            });
            this.materials = materials;
        });
    }

    disable(): void {
        if (!this.isRequired) {
            this.selectedSkinnedMeshes.forEach(i => {
                this.toggleMesh(i);
            });
        }
    }

    isSelected(name: string): boolean {
        return this.selectedSkinnedMeshes.includes(name);
    }

    toggleMesh(toToggle: string): void {
        const selectedCount = this.selectedSkinnedMeshes.length;
        const mesh = this.mesh(toToggle);
        const alreadySelected = this.selectedSkinnedMeshes.includes(toToggle);
        if (mesh) {
            if (alreadySelected) {
                if (this.isRequired && (this.isSingular || selectedCount == 1)) {
                    return; //dont do anything
                }
                this.deselectMesh(toToggle);
            } else {
                if (this.isSingular && selectedCount > 0) {
                    this.deselectMesh(this.selectedSkinnedMeshes.pop());
                }
                this.selectMesh(toToggle);
            }
        }
    }

    getSelectedMeshes(): THREE.SkinnedMesh[] {
        return this.selectedSkinnedMeshes.map(name => this.mesh(name));
    }

    get disabled(): boolean {
        return this.selectedSkinnedMeshes.length == 0;
    }

    get meshes(): THREE.SkinnedMesh[] {
        return this.skinnedMeshes;
    }

    private mesh(name: string): THREE.SkinnedMesh {
        return this.skinnedMeshes.find(mesh => mesh.name === name);
    }

    private selectMesh(toSelect: string): void {
        this.mesh(toSelect).visible = true;
        this.selectedSkinnedMeshes.push(toSelect);
    }

    private deselectMesh(toDeselect: string): void {
        this.mesh(toDeselect).visible = false;
        this.selectedSkinnedMeshes = this.selectedSkinnedMeshes.filter(item => item !== toDeselect);
    }
}
