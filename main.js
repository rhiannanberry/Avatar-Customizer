
var components = {
    "skin":{
        textures: ['1-n', '2-n', '3-n', '4-n', '5-n', '5-n-2'],
        images: [],
        pixels:[],
        tint: '#ffffff',
        index: 0
    },
    "hair":{
        textures: ['Auburn', 'Black', 'Blair', 'Blonde', 'Brown', 'Dark Brown', 'Ginger', 'Grey', 'Light Brown', 'Red'],
        images: [],
        pixels:[],
        tint: '#ffffff',
        index: 0
    },
    "shirt":{
        textures: ['white','blue','volunteer'],
        images: [],
        pixels:[],
        tint: '#ffffff',
        index: 0
    },
    "logo_front":{
        textures: ['','duck','ae','gt'],
        images: [],
        pixels:[],
        tint: '#ffffff',
        index: 0
    },
    "jacket":{
        textures: ['','white','gray','gt', 'ae'],
        images: [],
        pixels:[],
        tint: '#ffffff',
        index: 0
    },
    "logo_back":{
        textures: ['','duck','ae','gt'],
        images: [],
        pixels:[],
        tint: '#ffffff',
        index: 0
    },
}

var img, canvas, me;

function updateTextureTint(part, val) {
    components[part].tint = val;
}

function updateTextureComponent(part, dir) {
    ind = components[part].index;
    len = components[part].textures.length;
    ind = (len + ind + dir)%len;
    components[part].index = ind;
    updateTexture();
}

function loadImages() {
    for (var key in components) {
        imgs = [];
        textures = components[key].textures;
        for (var t in textures) {
            if (t == '') continue;
            path = key + "/" + textures[t] + ".png"
            if (path.constructor.name !== 'Object') {
                source = { src: path };
            }
        
            // Resolve source and img when loaded
            const img = new Image();
            //img.onerror = () => reject(new Error('Couldn\'t load image'));
            //img.onload = () => resolve(Object.assign({}, source, { img }));

            img.src = source.src;
            imgs.push(img);

            img.onload = () => {
                var canvas = document.createElement("canvas"),
                    ppixels = [],
                    rgbPixel,
                    ctx,
                    data,
                    i;

                canvas.width = img.width;
                canvas.height = img.height;
                ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height);
                data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

                for (i = 0; i < data.length; i += 4) {
                    rgbPixel = [];
                    rgbPixel[0] = data[i];
                    rgbPixel[1] = data[i + 1];
                    rgbPixel[2] = data[i + 2];
                    ppixels.push(rgbPixel);
                }
                pixels = ppixels;
            }
        }
        components[key].images = imgs;
    }
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

    loadImages();

    //console.log(components);

    

    updateTexture();

    var dl = document.querySelector("#dl");
    dl.addEventListener("click", function(ev) {
        dl.href = img.src;
        dl.download = "custom_texture.png"
    })
}


window.onload = initialize;