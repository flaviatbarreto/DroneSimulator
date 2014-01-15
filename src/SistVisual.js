var app = null;
var canvas;
var shader;
var model;
var axis;
var gl;
var zTrans 	= 0.0;
var xTrans 	= 0.0;
var xRot	= 0.0;
var yRot	= 0.0;
var	scale	= 1.0;
var xSpeed	= 0.0;
var ySpeed	= 0.0;

var g_objDoc 		= null;	// The information of OBJ file
var g_drawingInfo 	= null;	// The information for drawing 3D model

// ********************************************************
// ********************************************************
function initGL(canvas) {

	gl = canvas.getContext("webgl");
	//gl.viewportWidth = canvas.width;
	//gl.viewportHeight = canvas.height;
   $('canvas')[0].height = $('body')[0].clientHeight;
   $('canvas')[0].width = $('body')[0].clientWidth;
   gl.viewportWidth = $('body')[0].clientWidth;
	gl.viewportHeight = $('body')[0].clientHeight;
   
   console.log(gl.viewportWidth,gl.viewportHeight);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	if (!gl) 
		alert("Could not initialise WebGL, sorry :-(");
	return gl;
}

// ********************************************************
// ********************************************************
// Read a file
function readOBJFile(fileName, gl, model, scale, reverse) {
	var request = new XMLHttpRequest();
	
	request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status !== 404) 
			onReadOBJFile(request.responseText, fileName, gl, model, scale, reverse);
		}
	request.open('GET', fileName, true); // Create a request to acquire the file
	request.send();                      // Send the request
}

// ********************************************************
// ********************************************************
// OBJ File has been read
function onReadOBJFile(fileString, fileName, gl, o, scale, reverse) {
	var objDoc = new OBJDoc(fileName);						// Create a OBJDoc object
	var result = objDoc.parse(fileString, scale, reverse);	// Parse the file
	
	if (!result) {
		g_objDoc 		= null; 
		g_drawingInfo 	= null;
		console.log("OBJ file parsing error.");
		return;
		}
		
	g_objDoc = objDoc;
}

// ********************************************************
// ********************************************************
// OBJ File has been read compleatly
function onReadComplete(gl, model, objDoc) {

// Acquire the vertex coordinates and colors from OBJ file
var drawingInfo = objDoc.getDrawingInfo();

	// Write date into the buffer object
	gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.vertices, gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.normals, gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.colors, gl.STATIC_DRAW);
	
	// Write the indices to the buffer object
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawingInfo.indices, gl.STATIC_DRAW);
	
	return drawingInfo;
}

// ********************************************************
// ********************************************************
// Create a buffer object, assign it to attribute variables, and enable the assignment
function createEmptyArrayBuffer(gl, a_attribute, num, type) {
	var buffer =  gl.createBuffer();  // Create a buffer object
	if (!buffer) {
		console.log('Failed to create the buffer object');
		return null;
		}
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);  // Assign the buffer object to the attribute variable
	
	return buffer;
}

// ********************************************************
// ********************************************************
// Create an buffer object and perform an initial configuration

function initOBJVertexBuffers(gl, program) {
	var o = new Object(); // Utilize Object object to return multiple buffer objects

	o.vertexBuffer = createEmptyArrayBuffer(gl, program.vPositionAttr, 3, gl.FLOAT); 
	o.normalBuffer = createEmptyArrayBuffer(gl, program.vNormalAttr, 3, gl.FLOAT);
	o.colorBuffer = createEmptyArrayBuffer(gl, program.vColorAttr, 4, gl.FLOAT);
	o.indexBuffer = gl.createBuffer();

	if (!o.vertexBuffer || !o.normalBuffer || 
		!o.colorBuffer 	|| !o.indexBuffer) 
		return null; 
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	return o;
}

// ********************************************************
// ********************************************************

function initAxisVertexBuffer(gl) {
	var o = new Object(); // Utilize Object object to return multiple buffer objects
	var vPos = new Array;
	var vColor = new Array;
	var vNormal = new Array;
	var lInd = new Array;

	// X Axis
	// V0
	vPos.push(0.0);
	vPos.push(0.0);
	vPos.push(0.0);
	vColor.push(1.0);
	vColor.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vNormal.push(1.0);
	vNormal.push(0.0);
	vNormal.push(0.0);
	// V1
	vPos.push(1.0);
	vPos.push(0.0);
	vPos.push(0.0);
	vColor.push(1.0);
	vColor.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vNormal.push(1.0);
	vNormal.push(0.0);
	vNormal.push(0.0);

	// Y Axis
	// V2
	vPos.push(0.0);
	vPos.push(0.0);
	vPos.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vNormal.push(0.0);
	vNormal.push(1.0);
	vNormal.push(0.0);
	// V3
	vPos.push(0.0);
	vPos.push(1.0);
	vPos.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vNormal.push(0.0);
	vNormal.push(1.0);
	vNormal.push(0.0);

	// Z Axis
	// V4
	vPos.push(0.0);
	vPos.push(0.0);
	vPos.push(0.0);
	vColor.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vColor.push(1.0);
	vNormal.push(0.0);
	vNormal.push(0.0);
	vNormal.push(1.0);
	// V5
	vPos.push(0.0);
	vPos.push(0.0);
	vPos.push(1.0);
	vColor.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vColor.push(1.0);
	vNormal.push(0.0);
	vNormal.push(0.0);
	vNormal.push(1.0);
	
	lInd.push(0);	
	lInd.push(1);	
	lInd.push(2);	
	lInd.push(3);	
	lInd.push(4);	
	lInd.push(5);	
	
	var temp = new Uint16Array(lInd);
	console.log('Uint16Array = '+temp.length);
	

	o.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, o.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vPos), gl.STATIC_DRAW);
	
	o.colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, o.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vColor), gl.STATIC_DRAW);
	
	o.normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, o.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vNormal), gl.STATIC_DRAW);
	
	o.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lInd), gl.STATIC_DRAW);
	
	return o;
}

// ********************************************************
// ********************************************************
function draw(gl, o, shaderProgram, primitive, numElements) {

	gl.bindBuffer(gl.ARRAY_BUFFER, o.vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vPositionAttr, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(shaderProgram.vPositionAttr);  
	
	gl.bindBuffer(gl.ARRAY_BUFFER, o.colorBuffer);
	gl.vertexAttribPointer(shaderProgram.vColorAttr, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(shaderProgram.vColorAttr);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, o.normalBuffer);
	gl.vertexAttribPointer(shaderProgram.vNormalAttr, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(shaderProgram.vNormalAttr); 

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

	gl.drawElements(primitive, numElements, gl.UNSIGNED_SHORT, 0);
}

// ********************************************************
// ********************************************************
function drawScene() {
	
var modelMat 	= new Matrix4();
var ViewMat 	= new Matrix4();
var ProjMat 	= new Matrix4();

	modelMat.setIdentity();
	ViewMat.setIdentity();
	ProjMat.setIdentity();

	gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	
    try {
    	gl.useProgram(shader);
   }catch(err){
      alert(err);
      console.error(err.description);
   }
   	
    ViewMat.setLookAt(	4.0, 4.0, 0.0, 
    					0.0, 0.0, 0.0,
    					0.0, 1.0, 0.0);
    
    ProjMat.setPerspective( 60.0, gl.viewportWidth / gl.viewportHeight, 0.1, 50.0);
    		
	gl.uniformMatrix4fv(shader.MMatUniform, false, modelMat.elements);
	gl.uniformMatrix4fv(shader.VMatUniform, false, ViewMat.elements);
	gl.uniformMatrix4fv(shader.PMatUniform, false, ProjMat.elements);

	draw(gl, axis, shader, gl.LINES, 3*2);

	modelMat.translate(xTrans, 0.0, zTrans);
	modelMat.rotate(xRot, 1.0, 0.0, 0.0);
	modelMat.rotate(yRot, 0.0, 1.0, 0.0);
	modelMat.scale(scale*1.5, scale*1.5, scale*1.5);
	
	gl.uniformMatrix4fv(shader.MMatUniform, false, modelMat.elements);
	gl.uniformMatrix4fv(shader.VMatUniform, false, ViewMat.elements);
	gl.uniformMatrix4fv(shader.PMatUniform, false, ProjMat.elements);

	draw(gl, model, shader, gl.TRIANGLES, g_drawingInfo.indices.length);	

}

var currentlyPressedKeys = {};
var filter = 0;

// ********************************************************
// ********************************************************
function handleKeyDown(event) {
	
	currentlyPressedKeys[event.keyCode] = true;

	if (String.fromCharCode(event.keyCode) == "F") {
		filter += 1;
		if (filter == 3) 
			filter = 0;
   }
}
    
// ********************************************************
// ********************************************************
function handleKeyUp(event) {
	
	currentlyPressedKeys[event.keyCode] = false;	
}


// ********************************************************
// ********************************************************
function handleKeys() {
	
	if (currentlyPressedKeys[27]) {
		// Esc
		xTrans   = 
      zTrans 	= 
		ySpeed 	=
		xSpeed 	= 
		xRot	= 
		yRot	= 0.0;
   }
	if (currentlyPressedKeys[68]) {
		// A
		yRot -= 0.5;
   }
	if (currentlyPressedKeys[65]) {
		// D
		yRot += 0.5;
   }
   if(currentlyPressedKeys[87]){
      // S
      xTrans -= 0.5;
      degToRad();
      zTrans -= 0.5;
   }
   if(currentlyPressedKeys[83]){
      // W
      xTrans += 0.5;
      zTrans += 0.5;
   }
	if (currentlyPressedKeys[37]) {
		// Left cursor key
		ySpeed -= 0.5;
   }
	if (currentlyPressedKeys[39]) {
		// Right cursor key
		ySpeed += 0.5;
   }
	if (currentlyPressedKeys[38]) {
		// Up cursor key
		xSpeed -= 0.5;
   }
	if (currentlyPressedKeys[40]) {
		// Down cursor key
		xSpeed += 0.5;
   }
}
    
var lastTime = 0;

// ********************************************************
// ********************************************************
function animate() {
	var timeNow = new Date().getTime();
	if (lastTime != 0) {
		var elapsed = timeNow - lastTime;
      
//		xRot += (xSpeed * elapsed) / 1000.0;
//		yRot += (ySpeed * elapsed) / 1000.0;
   }
	lastTime = timeNow;
}
   
function degToRad(degrees) {
      return degrees * Math.PI / 180;
}
// ********************************************************
// ********************************************************
function webGLStart() {

	canvas            = document.getElementById("SistVisual");
	document.onkeydown= handleKeyDown;
	document.onkeyup 	= handleKeyUp;
	
	gl = initGL(canvas);
	
	shader = initShaders("SistVisual", gl);	
	
	shader.vPositionAttr	= gl.getAttribLocation(shader, "aVertexPosition");		
	shader.vNormalAttr 		= gl.getAttribLocation(shader, "aVertexNormal");
	shader.vColorAttr 		= gl.getAttribLocation(shader, "aVertexColor");
	shader.MMatUniform 		= gl.getUniformLocation(shader, "uModelMat");
	shader.VMatUniform 		= gl.getUniformLocation(shader, "uViewMat");
	shader.PMatUniform 		= gl.getUniformLocation(shader, "uProjMat");
	
	if (shader.vPositionAttr < 0 || shader.vColorAttr < 0 || 
		shader.vNormalAttr < 0 || !shader.MMatUniform ||
		!shader.VMatUniform || !shader.PMatUniform ) {
		console.log("Error getAttribLocation"); 
		return;
   }
		
	axis = initAxisVertexBuffer(gl);
	if (!axis) {
		console.log('Failed to set the AXIS vertex information');
		return;
   }
		
	model = initOBJVertexBuffers(gl, shader);
	if (!model) {
		console.log('Failed to set the OBJ vertex information');
		return;
   }
		
	readOBJFile("../modelos/quadcopter-sm450.obj", gl, model, 1, true);
	
	var tick = function() {   // Start drawing
		if (g_objDoc != null && g_objDoc.isMTLComplete()) { // OBJ and all MTLs are available
			g_drawingInfo = onReadComplete(gl, model, g_objDoc);
			g_objDoc = null;
			
			scale = 1 / Math.max(	Math.abs(g_drawingInfo.BBox.Max.x - g_drawingInfo.BBox.Min.x),
									Math.abs(g_drawingInfo.BBox.Max.y - g_drawingInfo.BBox.Min.y),
									Math.abs(g_drawingInfo.BBox.Max.z - g_drawingInfo.BBox.Min.z));
			}
		requestAnimationFrame(tick, canvas);
		if (g_drawingInfo) { 
			handleKeys();
			drawScene();
			animate();
			}
		};
		
	tick();
}


