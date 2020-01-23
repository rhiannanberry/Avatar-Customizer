import * as THREE from "three";
import { Color } from "three";
import {until} from "./util";

export class TextureGroup {
    _obj;
    _textures;
    _images;
    _tints;
    _tint;
    _canvases = [] ;
    _index;
    parent;
    loaded;
    tint;

    constructor( path,  filenames,  enabled=true) {
        this._textures.length = filenames.length;
        this._images.length = filenames.length;
        this._tints.length = filenames.length;
        this._canvases.length = filenames.length;

        let img_loader = new THREE.ImageLoader();

        let t = this;

        let promises = [];
        
        
        for (let i=0; i < filenames.length; i++ ) {
            let fullpath = path + filenames[i] + '.png';
            promises.push(
                new Promise(function (resolve) {
                img_loader.load(fullpath, function( img ) {
                    t._images[i] = img;
                    t._canvases[i] = window.document.createElement('canvas');
                    t._canvases[i].width=1024;
                    t._canvases[i].height=1024;
                    let ctx = t._canvases[i].getContext('2d');
                    ctx.drawImage(img, 0,0);
                    t._tints[i] = t._tint;
                    resolve();
                });
            })
            );
        }
        
        Promise.all(promises).then(() => this.loaded = true);
    }

    async updateTint(tint) {
        await until(() => {return this.loaded == true;});
        this._tint = tint;
        if(this._tints[this._index] != tint) {
            this._tints[this._index] = tint;
            this._createNewCanvas();
            if (this.parent != null) {
                this.parent.layerTextures();
            }
        }
    }

    async updateIndex(index) {
        await until(() => {return this.loaded == true;});
        if (this._index != index) {
            this._index = index;

            if (this._tints[this._index] != this._tint) {
                this._tints[this._index] = this._tint;
                this._createNewCanvas();
                if (this.parent != null) {
                    this.parent.layerTextures();
                }
            }
        }
    }

    _createNewCanvas() {
        let canvas = window.document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        let ctx = canvas.getContext('2d');

        ctx.clearRect(0,0,1024,1024);
        ctx.drawImage(this._images[this._index],0,0);
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = this._tint;
        ctx.fillRect(0,0,1024,1024);
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(this._images[this._index],0,0);
        ctx.globalCompositeOperation = 'source-over';

        this._canvases[this._index] = canvas;
    }

    async getTexture(tinted=false) {
        await until(() => {return this.loaded == true;});
        return this._canvases[this._index];    
    }
}

export class SimpleModelPart {
    images = [];
    _obj ;
    _material ;
    _textures  = []; 
    _index =0;
    loaded =false;
    _tint ='#ffffff';

    constructor(material, path, filenames, enabled=true) {
        this._material = material;
        //this._material.transparent = true;

        this._textures.length = filenames.length;

        let loader = new THREE.TextureLoader();

        let t = this;

        for (let i=0; i < filenames.length; i++ ) {
            let fullpath = path + filenames[i] + '.png';
            loader.load(fullpath, function( texture ) {
                texture.flipY = false;
                texture.wrapS = 1000;
                texture.wrapT = 1000;
                texture.encoding = 3001;
                t._textures[i] = texture;

                if (i == 0) {
                    t._material.map = texture;
                    t._material.needsUpdate = true;
                }
            });
        }
    }

    updateTint(tint ) {
        if (this._tint != tint) {
            this._tint = tint;

            this._material.color = new Color(tint);
            this._material.needsUpdate = true;
        }
    }

    updateTextureIndex(index) {
        if (this._index != index) {
            this._index = index;

            this._material.map = this._textures[index];
            this._material.needsUpdate = true;
        }
    }
}

export class ComplexModelPart {
    _renderer ;
    _textureGroups;
    _material;
    _index=0;
    loaded=false;

    //Needs renderer to use copyTextureToTexture
    constructor(renderer, material, textureGroups, enabled=true) {
        this._renderer = renderer;
        this._material = material;
        this._material.transparent = true;

        this._textureGroups = textureGroups;

        this._textureGroups.forEach((tGroup) => {
            tGroup.parent = this;
        })

        this.layerTextures();
    }

    async layerTextures(){
        let canvas = window.document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        let ctx = canvas.getContext('2d');
        let promises = [];
        this._textureGroups.forEach(async tgroup => {

            promises.push( new Promise( async function(resolve) {
                        let canvImg = await tgroup.getTexture();
                        ctx.drawImage(canvImg,0,0);
                        resolve();
                    }
                )
            )
        });

        Promise.all(promises).then( () => {
            let t=this;

            let loader = new THREE.TextureLoader();

            loader.load(canvas.toDataURL(), function(tex) {
                tex.flipY = false;
                tex.wrapS = 1000;
                tex.wrapT = 1000;
                tex.encoding = 3001;
                t._material.map = tex;
                t._material.needsUpdate = true;

                
            });
        })
    }

    updateTint(index, tint) {
        this._textureGroups[index].updateTint(tint).then(() => this.layerTextures());
    }
}
