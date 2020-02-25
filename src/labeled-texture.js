import * as THREE from "three";

export class LabeledTexture {
  constructor(path, label = "Default", autoLoad = false) {
    this.label = label;
    this.path = path;
    this.loaded = undefined;
    if (autoLoad) this.getTexture(path);
  }

  getTexture() {
    return new Promise((resolve, reject) => {
      if (this.loaded) {
        resolve(this.texture);
      } else {
        new THREE.TextureLoader().load(
          this.path,
          texture => {
            if (texture.image.width != 1024 || texture.image.height != 1024) {
              const canvas = document.createElement('canvas');
              canvas.width = 1024;
              canvas.height = 1024;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(texture.image, 0, 0, texture.image.width, texture.image.height);
              this.path = canvas.toDataURL();
              resolve(this.getTexture());
            } else {
              
              this.loaded = true;
              this.texture = texture;
              this.texture.flipY = false;
              resolve(this.texture);
            }
          },
          undefined,
          e => {
            this.loaded = false;
            reject(e);
          }
        );
      }
    });
  }
}
