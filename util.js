
function applyColor(image, hex_color) {
  return new Promise(resolve => {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
  
    ctx.drawImage(image,0,0);
    ctx.globalCompositeOperation = 'source-atop';
    
    ctx.fillStyle = hex_color;
    ctx.fillRect(0,0,image.width, image.height);
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(image,0,0);
    ctx.globalCompositeOperation = 'source-over';
    
  
    var img = new Image();
    img.src = canvas.toDataURL();
    img.onload = () => resolve(img);
  });
  //return img;
}

function applyTint(pixelData, hex_color) {
  clr = hexToRgb(hex_color);
  console.log(clr);
  var out = false;
  for (i = 0; i < pixelData.length; i += 4) {
    if (!out && pixelData[i] != 0) {
      console.log(i);
      console.log(pixelData[i]);
      out = true;

    }
      pixelData[i] *= clr.r;
      pixelData[i + 1] *= clr.g;
      pixelData[i + 2] *= clr.b;
  }
  return pixelData;
}

function getpath(dir, filename) {
  return dir + '/' + filename + '.png';
}