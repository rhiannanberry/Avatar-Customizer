// i think we're just gonna chuck all skinned meshes into this bitch and tolggle visibility
// then for export, clone and then delete unselected parts
export default class AvatarBase {
    //is the singular, base scene that will be ground truth for skeleton, animations,  and material
    constructor(scene) {
        //make sure excess skinned meshes are removed
        this._scene = scene;
        this._partLists = [];
    }

    addPartList(list) {
        this._partLists.push(list);
        this._scene.children[0].children[1].push(...(list.skinnedMeshes));
    }

    exportAvatar() {
        //need to clone this._scene
        //flatten materials from each part list together
        //delete all skinned meshes but 1 to use as base
        //merge buffer geometry all of them and put in skinned mesh
        //apply flattened material to that skinned mesh
    }
}