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
            this.loaded = true;
            this.texture = texture;
            this.texture.flipY = false;
            resolve(this.texture);
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
