Demo.event.onEnterFrame = function(t){
	camera.screen.clearRect(0, 0, camera.width, camera.height);
	camera.screen.strokeStyle = "red";
	
	camera.ry = -(Demo.mouse.x/camera.width - 0.5)*Math.PI*2;
	camera.rx = (Demo.mouse.y/camera.height)*Math.PI/2;
	
	camera.y = -Math.sin(camera.rx)*300;
	ryRadius = Math.cos(camera.rx)*300;
	
	camera.x = Math.sin(camera.ry)*ryRadius;
	camera.z = -Math.cos(camera.ry)*ryRadius;
	
	render(world, camera);
};
Demo.event.onGameStart = function(e){			
	
	
	for(var i=0; i<world.lines.length; i++){
		var line = world.lines[i];
		line.p1 = world.vertices[line.p1];
		line.p2 = world.vertices[line.p2];
	}
};


function render(world, camera){
	var toDraw = [];

	for(var i=0; i<world.vertices.length; i++){
		var vertex = world.vertices[i];
		
		var dx = vertex.x - camera.x;
		var dy = vertex.y - camera.y;
		var dz = vertex.z - camera.z;
		
		var d1x = Math.cos(camera.ry)*dx + Math.sin(camera.ry)*dz;
		var d1y = dy;
		var d1z = Math.cos(camera.ry)*dz - Math.sin(camera.ry)*dx;
		
		var d2x = d1x;
		var d2y = Math.cos(camera.rx)*d1y - Math.sin(camera.rx)*d1z;
		var d2z = Math.cos(camera.rx)*d1z + Math.sin(camera.rx)*d1y;
		
		var d3x = Math.cos(camera.rz)*d2x + Math.sin(camera.rz)*d2y;
		var d3y = Math.cos(camera.rz)*d2y - Math.sin(camera.rz)*d2x;
		var d3z = d2z;
		
	
		var scale = camera.depth / d3z;	
		vertex.posX = scale * d3x + camera.offsetX;
		vertex.posY = scale * d3y + camera.offsetY;
		vertex.posZ = scale;
	}
	
	for(var i=0; i<world.lines.length; i++){
		var line = world.lines[i];
		if(line.p1.posZ > 0 && line.p2.posZ > 0){
			toDraw.push({
				posX1: line.p1.posX,
				posY1: line.p1.posY,
				posX2: line.p2.posX,
				posY2: line.p2.posY,
				posZ: (line.p1.posZ + line.p2.posZ)/2
			});
		}
		
	}
	
	toDraw.sort(function(a, b){
		return a.posZ - b.posZ;
	});
	
	for(var i=0; i<toDraw.length; i++){
		camera.screen.beginPath();
		camera.screen.moveTo(toDraw[i].posX1, toDraw[i].posY1);
		camera.screen.lineTo(toDraw[i].posX2, toDraw[i].posY2);
		camera.screen.stroke();
	}
}


var world = {
	vertices:[
		{x:100, y:100, z: 100},
		{x:-100, y:100, z: 100},
		{x:-100, y:-100, z: 100},
		{x:100, y:-100, z: 100},
		{x:100, y:100, z: -100},
		{x:-100, y:100, z: -100},
		{x:-100, y:-100, z: -100},
		{x:100, y:-100, z: -100},
	],
	lines:[
		{p1: 0, p2: 1},
		{p1: 1, p2: 2},
		{p1: 2, p2: 3},
		{p1: 3, p2: 0},
		
		{p1: 4, p2: 5},
		{p1: 5, p2: 6},
		{p1: 6, p2: 7},
		{p1: 7, p2: 4},
		
		
		{p1: 0, p2: 4},
		{p1: 1, p2: 5},
		{p1: 2, p2: 6},
		{p1: 3, p2: 7},
		
	]
};

var camera = {
	x: 0,
	y: 0,
	z: 400,
	rx: 0,
	ry: 0,
	rz: 0,
	depth: 350,
	screen: Demo.ctx,
	width: Demo.canvas.width,
	height: Demo.canvas.height,
	offsetX: Demo.canvas.width/2,
	offsetY: Demo.canvas.height/2
}

