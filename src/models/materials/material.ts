import * as THREE from "three";
export class Material {
    material : THREE.MeshStandardMaterial;
    isRequired: Boolean;

    constructor(textureURL : string = null, isRequired: Boolean = false) {
        this.isRequired = isRequired;
        this.material = new THREE.MeshStandardMaterial();
        this.material.transparent = true;

        if (textureURL) {
            load(textureURL).then(texture => {
                this.material.map = texture as THREE.Texture;
                this.material.map.flipY = false;
                this.material.needsUpdate = true;
            })
        }
    }

    getFlattenedTexture(): null | HTMLCanvasElement { //figure out return type
        if (!this.material.visible) {
            return null;
        }

        const texture = this.material.map.image;
        const color : THREE.Color = this.material.color;

        const canvas = window.document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;

        const ctx = canvas.getContext("2d");
        ctx.globalCompositeOperation = "copy";
        ctx.drawImage(texture, 0, 0);

        if (color.equals(new THREE.Color("white"))) {
            return canvas;
        }

        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = color.getStyle();
        ctx.fillRect(0, 0, 1024, 1024);
        ctx.globalCompositeOperation = "destination-atop";
        ctx.drawImage(texture, 0, 0);

        return canvas;
    }
}

function load(src : string) {
    return new Promise((resolve, reject) => {
        const _loader = new THREE.TextureLoader();
        _loader.load(
            src,
            (val) => {
                resolve(val);
            },
            undefined,
            (err) => {
                reject(err);
            }
        )
    })
}