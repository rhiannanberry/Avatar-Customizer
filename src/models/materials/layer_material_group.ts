import { CustomLayerMaterial } from "./custom_layer_material";
import { LayerMaterial } from "./layer_material";

export class LayerMaterialGroup {
    private selected: number;
    private layerMaterials: LayerMaterial[];
    private customLayerMaterial: CustomLayerMaterial;

    constructor(texturePaths: string[]) {
        this.layerMaterials = texturePaths.map(path => {
            return new LayerMaterial(path);
        })
    }

    get disabled() {
        let isDisabled = true;
        this.layerMaterials.forEach((material, i) => {
            if (material.material.visible) {
                isDisabled = false;
                this.selected = i;
                return;
            }
        })
        return isDisabled;
    }
}