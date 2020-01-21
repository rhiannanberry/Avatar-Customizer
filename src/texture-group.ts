import * as THREE from "three";
import { Color } from "three";

export class TextureGroup {
    _obj : THREE.Object3D;
    _textures : THREE.Texture[] = [];
    _images : HTMLImageElement[]=[];
    _index : number=0;
    index : number=0;
    loaded : boolean=false;
    _tint : string='#ffffff';
    tint : string='#ffffff';

    // @ts-ignore
    canvas : HTMLCanvasElement = window.document.createElement('canvas');
    ctx : CanvasRenderingContext2D;

    constructor( public path: string, public filenames:string[], public enabled:boolean=true) {
        this._textures.length = filenames.length;

        let tex_loader = new THREE.TextureLoader();

        let t = this;

        let promises = [];
        
        
        for (let i:number=0; i < filenames.length; i++ ) {
            let fullpath : string = path + filenames[i] + '.png';
            promises.push(
                new Promise(function (resolve) {
                tex_loader.load(fullpath, function( texture ) {
                    texture.flipY = false;
                    texture.wrapS = 1000;
                    texture.wrapT = 1000;
                    texture.encoding = 3001;
                    t._textures[i] = texture;
                    resolve();
                });
            })
            );
        }
        
        Promise.all(promises).then(() => this.loaded = true);

        this.canvas.width=1024;
        this.canvas.height=1024;

        this.ctx = this.canvas.getContext('2d');
    }

    updateValues() {
        this._index = this.index;
        this._tint = this.tint;
    }

    async getTexture(tinted:boolean=false) : Promise<THREE.Texture> {
        if (tinted == false) {
            this.updateValues();
            return this._textures[this.index];
        }
        
        let texture = this._textures[this.index].clone();
        
        if (this.index == this._index && this.tint == this._tint) {
            this.updateValues();
            texture.image = this._images[this.index];
            return texture;
        } 

        this.updateValues();

        if (this.tint == '#ffffff') {
            return texture;
        }
        let tex_loader = new THREE.TextureLoader();
        this.ctx.clearRect(0,0,1024,1024);

        this.ctx.drawImage(texture.image,0,0);
        
        this.ctx.globalCompositeOperation = 'source-atop';
        this.ctx.fillStyle = this._tint;
        this.ctx.fillRect(0,0,1024,1024);
        
        this.ctx.globalCompositeOperation = 'multiply';
        this.ctx.drawImage(texture.image,0,0);

        this.ctx.globalCompositeOperation = 'source-over';

        tex_loader.load(this.canvas.toDataURL(), 
            function( newtexture ) {
                newtexture.flipY = false;
                newtexture.wrapS = 1000;
                newtexture.wrapT = 1000;
                newtexture.encoding = 3001;
                return newtexture;
            }
        );   
    }
}

export class SimpleModelPart {
    images : HTMLImageElement[] = [];
    _obj : THREE.Object3D;
    _material : THREE.MeshBasicMaterial;
    _textures : THREE.Texture[] = []; 
    _index : number=0;
    loaded : boolean=false;
    _tint : string='#ffffff';

    constructor(public material: any, public path: string, public filenames:string[], public enabled:boolean=true) {
        this._material = material;
        this._material.transparent = true;

        this._textures.length = filenames.length;

        let loader = new THREE.TextureLoader();

        let t = this;

        for (let i:number=0; i < filenames.length; i++ ) {
            let fullpath : string = path + filenames[i] + '.png';
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

    updateTint(tint : string) {
        if (this._tint != tint) {
            this._tint = tint;

            this._material.color = new Color(tint);
            this._material.needsUpdate = true;
        }
    }

    updateTextureIndex(index : number) {
        if (this._index != index) {
            this._index = index;

            this._material.map = this._textures[index];
            this._material.needsUpdate = true;
        }
    }
}

export class ComplexModelPart {
    _textureGroups : TextureGroup[];
    _material : THREE.MeshBasicMaterial;
    _index : number=0;
    loaded : boolean=false;

    //Needs renderer to use copyTextureToTexture
    constructor(public material: any, public textureGroups:TextureGroup[], public enabled:boolean=true) {
        this._material = material;
        this._material.transparent = true;

        this._textureGroups = textureGroups;

        this._textures.length = filenames.length;

        let loader = new THREE.TextureLoader();

        let t = this;

        for (let i:number=0; i < filenames.length; i++ ) {
            let fullpath : string = path + filenames[i] + '.png';
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

    layerTextures() {
        let tex = this._textureGroups[0].getTexture(true).clone();
    }
}
/*

export class ComplexModelPart {
    // @ts-ignore
    canvas : HTMLCanvasElement = window.document.createElement('canvas');
    ctx : CanvasRenderingContext2D;

    constructor (public object:any, public textureGroups: TextureGroup[]) {
        this.canvas.width = 1024;
        this.canvas.height = 1024;
        this.ctx = this.canvas.getContext('2d');
        
        object.geometry.clearGroups();

        let materials : THREE.MeshBasicMaterial[] = [];

        let cnt : number = 0;
        for(cnt; cnt<textureGroups.length; cnt++) {
            object.geometry.addGroup(0, Infinity, cnt);
            materials.push(new THREE.MeshBasicMaterial({
                color: new THREE.Color(0xff00ff)
            }));
        }


        let p : any = object.parent;
        console.log(object);
        let m : any = new THREE.Mesh(object.geometry);
        //object = new THREE.Mesh(object.geometry, materials);

        p.add(m);
        console.log(object);
        
    }

    updateTint(index, tint) {
        this.textureGroups[index].tint = tint;
    }

    async getTexture() : Promise<string>{
        for( const textureGroup of this.textureGroups ) {
            await textureGroup.getImage().then((img) => {
                this.ctx.drawImage(img,0,0);
            });
        }
        return this.canvas.toDataURL('image/png', 100);
    }

    setTexture() {
        this.getTexture().then(b64 => {
            let newMat = new THREE.TextureLoader().load(b64);
            newMat.flipY=false;
            newMat.wrapS=1000;
            newMat.wrapT=1000;
            newMat.encoding=3001;
            this.object.material.map = newMat;
            this.object.material.needsUpdate=true;
                
        });
    }
}

export class ModelPart extends ComplexModelPart{
    constructor (object:Object, baseTextureGroup: TextureGroup) {
        super(object, [baseTextureGroup]);
    }

    updateTint(tint) {
        this.textureGroups[0].tint = tint;
    }
}
*/