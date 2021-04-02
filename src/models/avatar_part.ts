import * as THREE from "three";
import { Material } from "./materials/material";

export default class AvatarPart {
    isRequired: Boolean;
    isSingular: Boolean;
    //private sharesMaterials: Boolean = true;
    private selectedSkinnedMeshes: number[] = [];
    private skinnedMeshes: THREE.SkinnedMesh[];

    constructor(isRequired: Boolean, isSingular:Boolean, skinnedMeshes: THREE.SkinnedMesh[]) {
        this.isRequired = isRequired;
        this.isSingular = isSingular;
        this.skinnedMeshes = skinnedMeshes;
        if (this.isRequired) {
            this.selectedSkinnedMeshes.push(0); //TODO: Maybe set this to random among sm
        }
        this.skinnedMeshes.forEach((mesh, i) => {
            mesh.visible = this.isSelected(i);
        }) 
    }

    assignSkeleton(skeleton: THREE.Skeleton) {
        this.skinnedMeshes.forEach(mesh => {
            mesh.bind(skeleton);
        })
    }

    assignNewMaterials(materials: THREE.MeshStandardMaterial[] | Material[]) {
        this.skinnedMeshes.forEach(mesh => {
            mesh.material = [];
            mesh.geometry.clearGroups();
            materials.forEach((material: THREE.MeshStandardMaterial | Material, i: number) => {
                mesh.geometry.addGroup(0, Infinity, i);
                if (material instanceof Material){
                    // @ts-ignore
                    mesh.material.push(material.material);
                } else {
                    // @ts-ignore
                    mesh.material.push(material);
                }
                
            })
        })
    }

    disable() {
        if (!this.isRequired) {
            this.selectedSkinnedMeshes.forEach((i) => {
                this.toggleMesh(i);
            })
        }
    }

    isSelected(index: number) {
        return this.selectedSkinnedMeshes.includes(index);
    }

    toggleMesh(toToggle : number | string) {
        var value : null | number;
        if (typeof toToggle === "string") {
            this.skinnedMeshes.forEach((mesh, i) => {
                if(mesh.name == toToggle) {
                    value = i;
                }
            });
        } else {
            value = toToggle as number;
        }
        
        const selectedCount = this.selectedSkinnedMeshes.length;
        const meshCount = this.skinnedMeshes.length;

        if (value !== null && value < meshCount) {

            const alreadySelected = this.selectedSkinnedMeshes.includes(value);
            if(alreadySelected) {
                if (this.isRequired && (this.isSingular || selectedCount == 1)) {
                    return; //dont do anything
                }
                this.deselectMesh(value);
            } else {
                if (this.isSingular && selectedCount > 0) {
                    this.deselectMesh(this.selectedSkinnedMeshes.pop());
                }
                this.selectMesh(value);
            }
        }
    }

    getSelectedMeshes() : THREE.SkinnedMesh[] {
        return this.selectedSkinnedMeshes.map(i => this.skinnedMeshes[i]);
    }

    get disabled() {
        return this.selectedSkinnedMeshes.length == 0;
    }

    get meshes() {
        return this.skinnedMeshes;
    }

    private selectMesh(toSelect : number) {
        this.skinnedMeshes[toSelect].visible = true;
        this.selectedSkinnedMeshes.push(toSelect);
    }

    private deselectMesh(toDeselect : number) {
        this.skinnedMeshes[toDeselect].visible = false;
        this.selectedSkinnedMeshes = this.selectedSkinnedMeshes.filter(item => item !== toDeselect);
    }
}