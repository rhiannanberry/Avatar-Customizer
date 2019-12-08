const defaultOptions = {
	format: 'image/png',
	quality: 1.0,
	width: 1024,
	height: 1024,
	Canvas: undefined
};

function loadAllImages(components) {
    return new Promise(resolve => {
        componentGroupPromises = Object.keys(components).map( part => new Promise( resolve => {
            const imgPromises = components[part].textures.map( source => new Promise(function (resolve, reject) {
                if (source == '') {
                    resolve(Object.assign({}, { image:null }));
                } else {

                    fullpath = getpath(part, source);

                    const img = new Image();
                    img.src = fullpath;
                    img.onerror = () => reject(Object.assign({}, { image:null }));
                    img.onload = () => resolve(Object.assign({}, { image:img }));
                }

            }));
            resolve(Promise.all(imgPromises));
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

const tintAndMergeImages = (sources) => new Promise(resolve => {
    options = defaultOptions;
   
    // Setup browser/Node.js specific variables
	const canvas = options.Canvas ? new options.Canvas() : window.document.createElement('canvas');
	if (options.Canvas) {
		options.quality *= 100;
    }
    
    const ctx = canvas.getContext('2d');

    canvas.width = options.width;
    canvas.height = options.height;

    var promises = [];
    
    for (let [k, el] of Object.entries(sources)) {
        
        promises.push( new Promise( resolve => {
        var i = el['index'];
        var images = el['images'];
        
        if(el['textures'][i] != '') {
            var image = images[i]['image'];
            ctx.globalAlpha = image.opacity ? image.opacity : 1;
            ctx.globalCompositeOperation = 'source-over';
            if(el['tint'] != '#ffffff') {
                
                applyColor(image, el['tint']).then( im => {
                    resolve({[k]:im});
                });

            } else {

                resolve({[k]:image});
            }
            image = null;

        } else {
            resolve({});
        }
        images = null;
        }));
        
    }


    Promise.all(promises).then((imgsRaw) => {
        var keys = Object.keys(sources);
        var imgs = {};
        imgsRaw.forEach(v => {
            if (v != undefined) {
                imgs = Object.assign(imgs, v);
            }
        });

        //Object.valuesimgsRaw.map()
        
        keys.forEach(k => {
            if ([k] in imgs) {
                ctx.drawImage(imgs[k], 0,0);
            }
        });
        imgs = null;
        imgsRaw = null;
        resolve( canvas.toDataURL(options.format, options.quality));
    })
    // Resolve all other data URIs sync
    

});