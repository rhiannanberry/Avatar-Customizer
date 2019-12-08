
var components = {
    "skin":{
        textures: ['1-n', '2-n', '3-n', '4-n', '5-n', '5-n-2'],
        tint: '#ffffff',
        index: 0
    },
    "hair":{
        textures: ['Auburn', 'Black', 'Blair', 'Blonde', 'Brown', 'Dark Brown', 'Ginger', 'Grey', 'Light Brown', 'Red'],
        tint: '#ffffff',
        index: 0
    },
    "shirt":{
        textures: ['white','blue','volunteer'],
        tint: '#ffffff',
        index: 0
    },
    "logo_front":{
        textures: ['','duck','ae','gt'],
        tint: '#ffffff',
        index: 0
    },
    "jacket":{
        textures: ['','white','gray','gt', 'ae'],
        tint: '#ffffff',
        index: 0
    },
    "logo_back":{
        textures: ['','duck','ae','gt'],
        tint: '#ffffff',
        index: 0
    },
}

var img, canvas, me;

function updateTextureTint(part, val) {
    //TODO: THROTTLE THIS
    components[part].tint = val;
    updateTexture();
}

function updateTextureComponent(part, dir) {
    ind = components[part].index;
    len = components[part].textures.length;
    ind = (len + ind + dir)%len;
    components[part].index = ind;
    updateTexture();
}

function getTextureComponents() {
    var sources = [];
    for(var i in Object.keys(components)) {
        var obj = components[Object.keys(components)[i]];
        var ind = obj['index'];
        var imgTint = obj['tint'];
        var imgData = obj['images'][ind]['pixelData'];
        sources.push({pixelData:imgData, tint:imgTint});
    }
    return sources;
}

function updateTexture() {
    tintAndMergeImages(components).then(function(b64) { 
        img.src=b64
        
        me.traverse(function(node) {
            if (node.material && node.type && node.type=='SkinnedMesh') {
    
                newmap = node.material.map = new THREE.TextureLoader().load(b64);
                newmap.flipY=false;
                newmap.wrapS=1000;
                newmap.wrapT=1000;
                newmap.encoding=3001;
                
                node.material.map = newmap;
                node.material.needsUpdate = true;
                }
        });
    });
}

function initialize() {
    img = document.createElement('img');
    canvas = document.createElement('canvas');
    me = document.querySelector("#me").getObject3D('mesh');

    loadAllImages(components).then((d) => {
        components = d;
        updateTexture();

        canvas.height = 1024;
        canvas.width = 1024;
        const ctx = canvas.getContext('2d');
        //ctx.putImageData(components['hair']['images'][0]['pixelData'], 0,0);
        //document.body.appendChild(canvas);
        

        var dl = document.querySelector("#dl");
        dl.addEventListener("click", function(ev) {
            dl.href = img.src;
            dl.download = "custom_texture.png"
        })

    });

    //console.log(components);

    


}


window.onload = initialize;