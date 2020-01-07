var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TextureGroup = /** @class */ (function () {
    function TextureGroup(path, filenames, enabled) {
        var _this = this;
        if (enabled === void 0) { enabled = true; }
        this.path = path;
        this.filenames = filenames;
        this.enabled = enabled;
        this.images = [];
        this.index = 0;
        this.loaded = false;
        this.tint = '#ffffff';
        this.canvas = window.document.createElement('canvas');
        this.canvas.width = 1024;
        this.canvas.height = 1024;
        this.ctx = this.canvas.getContext('2d');
        var promises = filenames.map(function (fname) { return new Promise(function (resolve, reject) {
            var fullpath = path + fname + '.png';
            var img = new Image();
            img.src = fullpath;
            img.onerror = function () { return reject(null); };
            img.onload = function () { return resolve(img); };
        }); });
        Promise.all(promises).then(function (imgs) {
            imgs.forEach(function (img) {
                if (img != null) {
                    _this.images.push(img);
                }
            });
            _this.loaded = true;
        });
    }
    TextureGroup.prototype.getImage = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.enabled) {
                if (_this.tint != '#ffffff') {
                    _this.ctx.clearRect(0, 0, 1024, 1024);
                    _this.ctx.drawImage(_this.images[_this.index], 0, 0);
                    _this.ctx.globalCompositeOperation = 'source-atop';
                    _this.ctx.fillStyle = _this.tint;
                    _this.ctx.fillRect(0, 0, 1024, 1024);
                    _this.ctx.globalCompositeOperation = 'multiply';
                    _this.ctx.drawImage(_this.images[_this.index], 0, 0);
                    _this.ctx.globalCompositeOperation = 'source-over';
                    var img = new Image();
                    img.src = _this.canvas.toDataURL();
                    img.onload = function () { return resolve(img); };
                    img.onerror = function () { return reject(); };
                }
                resolve(_this.images[_this.index]);
            }
            else {
                reject();
            }
        });
    };
    return TextureGroup;
}());
var ComplexModelPart = /** @class */ (function () {
    function ComplexModelPart(object, textureGroups) {
        this.object = object;
        this.textureGroups = textureGroups;
        this.canvas = window.document.createElement('canvas');
        this.canvas.width = 1024;
        this.canvas.height = 1024;
    }
    ComplexModelPart.prototype.getTexture = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var ctx = _this.canvas.getContext('2d');
            var imagePromises = _this.textureGroups.map(function (tGroup) { return new Promise(function (resolve) {
                tGroup.getImage().then(function (img) {
                    ctx.drawImage(img, 0, 0);
                    resolve();
                });
            }); });
            Promise.all(imagePromises).then(function () {
                resolve(_this.canvas.toDataURL('image/png', 100));
            });
        });
    };
    ComplexModelPart.prototype.setTexture = function () {
        var _this = this;
        this.getTexture().then(function (b64) {
            var newMat = new THREE.TextureLoader().load(b64);
            newMat.flipY = false;
            newMat.wrapS = 1000;
            newMat.wrapT = 1000;
            newMat.encoding = 3001;
            _this.object.material.map = newMat;
            _this.object.material.needsUpdate = true;
        });
    };
    return ComplexModelPart;
}());
var ModelPart = /** @class */ (function (_super) {
    __extends(ModelPart, _super);
    function ModelPart(object, baseTextureGroup) {
        return _super.call(this, object, [baseTextureGroup]) || this;
    }
    return ModelPart;
}(ComplexModelPart));
