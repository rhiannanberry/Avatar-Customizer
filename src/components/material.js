import { LabeledTexture } from "../labeled-texture";

export default class Material {
    constructor(material, label, labeledTextures, canDisable=false, active=true, 
        x=0, y=0, width=1024, height=1024, scaleTexture=false) {
        this.material = material;
        this.material.transparent = true;
        this.material.needsUpdate = true;
        this.label = label;
        this.labeledTextures = labeledTextures;
        this.canDisable = canDisable;
        this.active = active;
        this.x = x;
        this.y = y;
        this.width = width; 
        this.height = height;
        this.scaleTexture = scaleTexture;
        this.index = 0;
        if (labeledTextures != null) this.setTexture(0);
    }

    setActive(isActive) {
        this.active = isActive;
        this.material.visible = isActive;
        this.material.needsUpdate = true;
    }

    setColor(color) {
        this.material.color.set(color)
        this.material.needsUpdate = true;
    }

    setTextureByPath(path) {
        const index = this.labeledTextures.findIndex((element) => {
            return element.path == path;
        });

        setTexture(index);
    }

    setTexture(index) {

        if (index >= this.labeledTextures.length || index < 0) return;

        this.labeledTextures[index]
        .getTexture(
        this.x,
        this.y,
        this.width,
        this.height,
        this.scaleTexture
        ).then(texture => {
        this.material.visible = this.active;
        this.material.needsUpdate = true;
        this.material.map = texture;
        this.index = index;
        });
    }

    getTexture() {
        return this.labeledTextures[this.index].getTexture(this.x, this.y, this.width, this.height,
            this.scaleTexture);
    }

    getDownloadTexture() {
        //get current texture image
        const img = this.material.map.image;
        const clr = this.material.color;

        //bake in color
        const canvas = window.document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;

        if (this.active == false || this.material.visible == false) return canvas;

        const ctx = canvas.getContext("2d");
        ctx.globalCompositeOperation = "copy";
        ctx.drawImage(img, 0, 0);
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = clr.getHexStringFull();
        ctx.fillRect(0, 0, 1024, 1024);
        ctx.globalCompositeOperation = "destination-atop";
        ctx.drawImage(img, 0, 0);

        return canvas;
    }
}