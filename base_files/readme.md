# Base Files

## *.blend
- Blend files contain current avatar parts that appear in the customizer.
- Modeled on 2.83, un-tested with earlier versions.
- There's a separate *.blend for each part, and the options are saved as different objects.
- Export to [src/includes/models](../src/includes/models) as a *.glb

## uv_layout_v4.psd
- Every existing texture layer, with bleed and labels. 
- Export to [src/includes/textures](../src/includes/textures) as a *.png
- **Must be \*.png because each layer of texture requires transparency to stack correctly!**