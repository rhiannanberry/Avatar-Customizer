
var components = {
    "skin":{
        textures: ['1-n', '2-n', '3-n', '4-n', '5-n', '5-n-2'],
        index: 0
    },
    "hair":{
        textures: ['Auburn', 'Black', 'Blair', 'Blonde', 'Brown', 'Dark Brown', 'Ginger', 'Grey', 'Light Brown', 'Red'],
        index: 0
    },
    "shirt":{
        textures: ['white','blue','volunteer'],
        index: 0
    },
    "logo_front":{
        textures: ['','duck','ae','gt'],
        index: 0
    },
    "jacket":{
        textures: ['','white','gray','gt', 'ae'],
        index: 0
    },
    "logo_back":{
        textures: ['','duck','ae','gt'],
        index: 0
    },
}

var img, canvas, me;

function updateTextureComponent(part, dir) {
    ind = components[part].index;
    len = components[part].textures.length;
    ind = (len + ind + dir)%len;
    components[part].index = ind;
    updateTexture();
}

function getFilePaths() {
    filepaths = [];
    for(var key in components) {
        
        textures = components[key].textures;
        ind = components[key].index;
        if (textures[ind] == '') continue;
        filepaths.push(key +"/"+textures[ind]+".png");
    }
    return filepaths;
}

function updateTexture() {
    mergeImages(getFilePaths()).then(function(b64) { 
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

    updateTexture();

    var dl = document.querySelector("#dl");
    dl.addEventListener("click", function(ev) {
        dl.href = img.src;
        dl.download = "custom_texture.png"
    })
}


window.onload = initialize;