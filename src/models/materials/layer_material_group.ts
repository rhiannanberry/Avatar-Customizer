import { CustomLayerMaterial } from "./custom_layer_material";
import { LayerMaterial } from "./layer_material";

export class LayerMaterialGroup {
    private selected: Number;
    private layerMaterial: LayerMaterial[];
    private customLayerMaterial: CustomLayerMaterial;
}