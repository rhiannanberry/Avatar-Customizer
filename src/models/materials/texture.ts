import * as THREE from 'three';
import load from '../../util';

export default class Texture {
    private texture: THREE.Texture;
    private texturePromise: Promise<THREE.Texture>;
    private textureLoaded = false;
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    constructor(path: string, x: number, y = 476, width = 220, height = 270) {
        this.texturePromise = load(path);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    async getTexture(): Promise<THREE.Texture> {
        if (this.textureLoaded) {
            return this.texture;
        } else {
            const val = await this.texturePromise;
            const texture = val as THREE.Texture; //need to resize
            const img = texture.image;

            const differentSizes = [img.width, img.height] != [this.width, this.height];
            let w = this.width;
            let h = this.height;

            if (differentSizes || !this.x || !this.y) {
                const currentAspect = img.width / img.height;
                const desiredAspect = this.width / this.height;
                const fitToX = desiredAspect < currentAspect;

                w = fitToX ? this.width : (this.width / img.width) * img.height;
                h = fitToX ? (this.width / img.width) * img.height : this.height;
            }
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, this.x, this.y, w, h);

            const actualVal = await load(canvas.toDataURL());
            const actualTexture = actualVal as THREE.Texture;
            actualTexture.flipY = false;
            this.texture = actualTexture;
            this.textureLoaded = true;
            return this.texture;
        }
    }
}
