import * as THREE from "three";

export class LabeledTexture {
  constructor(path, label = "Default", autoLoad = false) {
    this.label = label;
    this.path = path;
    this.loaded = undefined;
    if (autoLoad) this.getTexture(path);
  }

  getTexture(x,y,width,height,scaleTexture, resized=false) {
    return new Promise((resolve, reject) => {
      if (this.loaded) {
        resolve(this.texture);
      } else {
        new THREE.TextureLoader().load(
          this.path,
          texture => {
            const img = texture.image;
            const sizeMismatched = [img.width, img.height] != [width, height];

            if (resized==false && (sizeMismatched || x != 0 || y != 0)) {
              var w = img.width;
              var h = img.height;
              if (scaleTexture && sizeMismatched) {
                const texAspect = img.width / img.height;
                const aspect = width / height;
                const fitToX = aspect < texAspect;

                w = (fitToX) ? width : (width / img.width) * img.height;
                h = (fitToX) ? (width / img.width) * img.height : height;
              }

              const canvas = document.createElement('canvas');
              canvas.width = 1024;
              canvas.height = 1024;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(texture.image,x,y,w,h);
              this.path = canvas.toDataURL();
              resolve(this.getTexture(0,0,1024,1024,false,true));
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

  scaleTexture() {

  }
}
