"use strict";

var gl;
var positions =[];

var numPositions = 5000;

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three positions.

    var vertices = [
        vec2(-1, -0.5),
        vec2(-0.5,  0.5),
        vec2(0, -0.5)
    ];

    var second_vertices = [
        vec2(0,-0.5),
        vec2(0.5, 0.5),
        vec2(1, -0.5)
    ];

    //divideTriangle( vertices[0], vertices[1], vertices[2], numPositions); // 3 vertices

    // Specify a starting positions p for our iterations
    // p must lie inside any set of three vertices

    var u = vec2((vertices[0][0] + vertices[1][0] + vertices[2][0]) / 3, (vertices[0][1] + vertices[1][1] + vertices[2][1]) / 3);
    var p = u;

    var a = vec2((second_vertices[0][0] + second_vertices[1][0] + second_vertices[2][0]) / 3, (second_vertices[0][1] + second_vertices[1][1] + second_vertices[2][1]) / 3);
    var q = a;

    // Add our initial positions into our array of points

    positions.push(p);

    // Compute new positions for the first triangle
    // Each new point is located midway between
    // last point and a randomly chosen vertex
    for (var i = 0; positions.length < numPositions; ++i) {
        var j = Math.floor(3 * Math.random());

        p = vec2((positions[i][0] + vertices[j][0]) / 2, (positions[i][1] + vertices[j][1]) / 2);
        positions.push(p);
    }

    // Add the initial position for the second triangle
    positions.push(q);

    // Compute new positions for the second triangle
    for (var i = numPositions; positions.length < 2 * numPositions; ++i) {
        var j = Math.floor(3 * Math.random());

        q = vec2((positions[i][0] + second_vertices[j][0]) / 2, (positions[i][1] + second_vertices[j][1]) / 2);
        positions.push(q);
    }

    

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays(gl.POINTS, 0, positions.length); //if you want to render with triagnles, use gl.TRIANGLES (could do with any shape)
}
