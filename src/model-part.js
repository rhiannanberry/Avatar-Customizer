
import { cloneDeep } from "lodash"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class ModelPart {
    //
    constructor(src, scene, scale=30, selected=null) {
        return new Promise((resolve, reject) => {
            const _loader = new GLTFLoader();
            _loader.load(
                src,
                (val) => {
                    this.model = cloneDeep(val);
                    console.log(val)
                    this.previewModel = val;
                    this.options = ([null]).concat(
                        val.scene.children[0].children.slice(1,-1).map((v) => {return v.name})
                    );
                    //select any value but zero
                    this.selected = selected ?
                        selected :
                        1+Math.floor(Math.random() * Math.floor(this.options.length-1));

                    this.setSelected(this.selected)

                    val.scene.scale.x = scale;
                    val.scene.scale.y = scale;
                    val.scene.scale.z = scale;

                    scene.add(val.scene);

                    resolve(this);
                },
                undefined,
                (err) => {
                    reject(err);
                }
            )
        })
    }

    getMaterial() {
        return this.previewModel.scene.children[0].children[1].material;
    }

    setMaterials(materials) {
        materials = materials.map((e) => {return e.material})
        this.previewModel.scene.children[0].children.forEach((v,i) => {
            if (i == 0) return;
            v.material = [];
            v.geometry.clearGroups();
            materials.forEach((mat,ii) => {
                v.geometry.addGroup(0,Infinity,ii);
                v.material.push(mat);
            })
        })
    }
/*
https://threejs.org/docs/#api/en/objects/SkinnedMesh
https://threejs.org/docs/#examples/en/utils/BufferGeometryUtils
https://stackoverflow.com/questions/45122359/three-js-how-to-merge-two-buffergeometries-and-keep-transforms
https://gltf-viewer.donmccurdy.com/
*/
    setSelected(index) {
        this.selected = index;
        this.previewModel.scene.children[0].children.forEach((v,i) => {
            if (i == 0) return;
            v.visible = i == index;
        });

        this.model.scene.children[0].children.forEach((v,i) => {
            if (i == 0) return;
            v.visible = i == index;
        });
    }

    setSelectedByString(str) {
        var ind = this.previewModel.scene.children[0].children.findIndex(
            v=>{return v.name.toLowerCase() == str.toLowerCase()}
        );
        ind = ind ? ind : 0;
        console.log(ind)
        this.setSelected(ind);
    }

    exportModel() {
        var toExport = cloneDeep(this.model);
        var selected = [];
        toExport.scene.children[0].children.forEach((v, i) => {
            if (i == 0 || i == this.selected) {
                selected.push(v);
            }
        })
        toExport.scene.children[0].children = selected;
        return toExport;
    }

}