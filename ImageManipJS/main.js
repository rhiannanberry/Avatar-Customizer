
var comps = {
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

function loadAllImages(components) {
    return new Promise(resolve => {
        componentGroupPromises = Object.keys(components).map( part => new Promise( resolve => {
            const imgPromises = components[part].textures.map( source => new Promise(function (resolve, reject) {
                if (source == '') {
                    resolve(Object.assign({}, { image:null, pixels:null }));
                } else {

                    fullpath = getpath(part, source);

                    const img = new Image();
                    img.src = fullpath;
                    img.onerror = () => reject(Object.assign({}, { image:null, pixels:null }));
                    img.onload = () => resolve(Object.assign({}, { image:img, pixels:getpixels(img) }));
                }

            }));
            resolve(Promise.all(imgPromises));
            //resolve(Promise.all(imgPromises));
        }));

        Promise.all(componentGroupPromises)
            .then(part => {
                keys = Object.keys(components);
                for (var ind in keys) {
                    console.log(keys[ind]);
                    components[keys[ind]].images = part[ind];
                }
                resolve(components);
            });
    });
}
function getpixels(img) {
    var canvas = document.createElement("canvas"),
                    pixels = [],
                    rgbPixel,
                    ctx,
                    data,
                    i;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    

    /*for (i = 0; i < data.length; i += 4) {
        rgbPixel = [];
        rgbPixel[0] = data[i];
        rgbPixel[1] = data[i + 1];
        rgbPixel[2] = data[i + 2];
        pixels.push(rgbPixel);
    }*/
    return data;
}

function applyTint(pixels, hex_color) {
    clr = hexToRgb(hex_color);
    console.log(clr);
    for (i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] *= clr.r;
        pixels.data[i + 1] *= clr.g;
        pixels.data[i + 2] *= clr.b;
    }
    return pixels;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16)/255,
      g: parseInt(result[2], 16)/255,
      b: parseInt(result[3], 16)/255
    } : null;
  }

function getpath(dir, filename) {
    return dir + '/' + filename + '.png';
}

function initialize() {
    img = document.createElement('img');
    canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    loadAllImages(comps).then((d)=>{console.log(d);});
    /*loadImageGroup('skin', components['skin']).then(() =>{
        console.log(components['skin']);
        canvas.width = 1064;
        canvas.height = 1064;
        ctx.putImageData(applyTint(components['skin'].images[0].pixels, '#abccdd'),0,0);
    }
    );*/
    document.body.appendChild(canvas);

}


window.onload = initialize;