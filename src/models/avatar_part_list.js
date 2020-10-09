export default class AvatarPartList {
    //Maybe extend this for the actual parts? idk
    //contains the whole list of options for the given part
    /*
        list --> many part
        list --> one material, shared across part
    */
    constructor(skinnedMeshes, customMaterials) {
        this._skinnedMeshes = skinnedMeshes;
        this._customMaterials = customMaterials;
        this._selectedIndex = 0;
        this._setSelected();
        this._applyMaterials();
    }

    get selectedIndex() {
        return this._selectedIndex;
    }

    get selected() {
        return this._skinnedMeshes[this._selectedIndex];
    }

    get material() {
        return this._material; //should return custom mat object?
    }

    get skinnedMeshes() {
        return this._skinnedMeshes;
    }

    set selectedIndex(index) {
        this._selectedIndex = index;
        this._setSelected();
    }

    _setSelected() {
        this._skinnedMeshes.forEach( (mesh, index) => {
            mesh.visible = index == this._selectedIndex;
        });
    }

    _applyMaterials() {
        this._skinnedMeshes.forEach( mesh => {
            mesh.material = this._customMaterials;
            mesh.geometry.clearGroups();
            for (var i = 0; i < this._customMaterials.length; i++) {
                mesh.geometry.addGroup(0, Infinity, i);
            }
        });
    }
}