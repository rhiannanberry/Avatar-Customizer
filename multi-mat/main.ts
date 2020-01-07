function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function until(fn:any) {
    while (!fn()) {
        await sleep(0)
    }
}

async function init() {
    let me = document.querySelector("#me");//.getObject3D('mesh');
    console.log(me);

    let part = new TextureGroup('../hair/', ['Auburn','Black','Blair']);
    let shirt = new TextureGroup('shirt/', ['white']);
    let jacket = new TextureGroup('jacket/', ['white']);

    await until(() => part.loaded == true && shirt.loaded==true && jacket.loaded ==true);
    shirt.tint = '#00ff00';
    let top = new ComplexModelPart(me.getObjectByName('Top', true), [shirt,jacket]);

    top.setTexture();

}


window.onload = init;