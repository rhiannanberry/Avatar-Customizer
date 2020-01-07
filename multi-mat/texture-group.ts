class TextureGroup {
    images : HTMLImageElement[]=[];
    index : number=0;
    loaded : boolean=false;
    tint : string='#ffffff';
    canvas : HTMLCanvasElement = window.document.createElement('canvas');
    ctx : CanvasRenderingContext2D;

    constructor(public path: string, public filenames:string[], public enabled:boolean=true) {
        this.canvas.width=1024;
        this.canvas.height=1024;

        this.ctx = this.canvas.getContext('2d');

        const promises = filenames.map(fname => new Promise((resolve, reject) => {
            let fullpath : string = path + fname + '.png';
            const img = new Image();
                    img.src = fullpath;
                    img.onerror = () => reject(null);
                    img.onload = () => resolve(img);
        }));
        Promise.all(promises).then((imgs:HTMLImageElement[]) => {
            imgs.forEach(img => {
                if (img != null) {
                    this.images.push(img);
                }
            });
            this.loaded = true;
        });
    }

    getImage() : Promise<HTMLImageElement>{
        return new Promise((resolve,reject) => {
            if (this.enabled) {
                if(this.tint != '#ffffff') {
                    this.ctx.clearRect(0,0,1024,1024);

                    this.ctx.drawImage(this.images[this.index],0,0);
                    
                    this.ctx.globalCompositeOperation = 'source-atop';
                    this.ctx.fillStyle = this.tint;
                    this.ctx.fillRect(0,0,1024,1024);
                    
                    this.ctx.globalCompositeOperation = 'multiply';
                    this.ctx.drawImage(this.images[this.index],0,0);

                    this.ctx.globalCompositeOperation = 'source-over';

                    var img = new Image();
                    img.src = this.canvas.toDataURL();
                    img.onload = () => resolve(img);
                    img.onerror = () => reject();

                }
                resolve(this.images[this.index]);
            } else {
                reject();
            }
        });
    }


}
class ComplexModelPart {
    canvas : HTMLCanvasElement = window.document.createElement('canvas');

    constructor (public object:any, public textureGroups: TextureGroup[]) {
        this.canvas.width = 1024;
        this.canvas.height = 1024;
    }

    getTexture() : Promise<string>{
        return new Promise(resolve => {
            const ctx = this.canvas.getContext('2d');
            const imagePromises = this.textureGroups.map(tGroup => new Promise(resolve => {
                tGroup.getImage().then((img) => {
                    ctx.drawImage(img,0,0);
                    resolve();
                });
            }));

            Promise.all(imagePromises).then(() => {
                resolve(this.canvas.toDataURL('image/png', 100));
            });
        });
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

class ModelPart extends ComplexModelPart{
    constructor (object:Object, baseTextureGroup: TextureGroup) {
        super(object, [baseTextureGroup]);
    }
}
