AFRAME.registerComponent("drag-rotate-x", {
    schema : { speed: {default:1}},
    init : function() {
        this.ifMouseDown = false;
        this.x_coord = 0;
        document.addEventListener('mousedown', this.OnDocumentMouseDown.bind(this));
        document.addEventListener('mouseup', this.OnDocumentMouseUp.bind(this));
        document.addEventListener('mousemove', this.OnDocumentMouseMove.bind(this));
    },
    OnDocumentMouseDown : function(e) {
        this.ifMouseDown = true;
        this.x_coord = e.clientX;
    },
    OnDocumentMouseUp : function() {
        this.ifMouseDown = false;
    },
    OnDocumentMouseMove : function(e) {
        if(this.ifMouseDown) {
            var temp_x = e.clientX - this.x_coord;

            this.el.object3D.rotateY(temp_x*this.data.speed / 1000);
            
            this.x_coord = e.clientX;
        }
    }
});


AFRAME.registerComponent("custom-mat", {
    init: function() {
        console.log("bruh");
        this.el.object3D.traverse(function(node) {
            if(node.material) {
                console.log("djjdjdjd");
                node.material = new THREE.MeshStandardMaterial({color: new THREE.Color(0xff00ff)});
            }
        })
    }
});

AFRAME.registerComponent("scroll-zoom", {
    schema : { 
        target: {type: 'selector'},
        speed: {type: 'number'}
    },
    init : function(){
        var targetPosition = this.data.target.object3D.position;
        var startPosition = this.el.object3D.position;
        var dir = new THREE.Vector3();
        dir.copy(startPosition).sub(targetPosition);

        this.distance = dir.length();
        this.direction = dir.normalize();
        this.inscene = false;

        document.querySelector('#scene').addEventListener('mouseenter', (function() {this.inscene = true;}).bind(this));
        document.querySelector('#scene').addEventListener('mouseout', (function() {this.inscene = false;}).bind(this));

        document.addEventListener('wheel', this.OnScroll.bind(this));
        
    },
    OnScroll : function(e) {
        if (this.inscene == false) return;
        var yDelta = e.deltaY;
        var currentPosition = this.el.object3D.position;
        
        var distChange = yDelta * this.data.speed;
        if (this.distance + distChange < 0) {
            distChange = -this.distance;
        }
        this.distance += distChange;

        this.el.setAttribute('position', {
            x: currentPosition.x + distChange * this.direction.x,
            y: currentPosition.y + distChange * this.direction.y,
            z: currentPosition.z + distChange * this.direction.z
        });
    }
});
