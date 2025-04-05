"use strict";

var canvas;
var gl;

var positions = [];
var colors = [];

var numTimesToSubdivide = 5;
var numBubbles = Math.floor(Math.random() * (20 - 5 + 1)) + 5;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three positions.

    let colorPalette = [
        vec4(0.6, 0.6, 1.0, 1.0),
        vec4(0.5, 0.5, 1.0, 1.0),
        vec4(0.4, 0.4, 1.0, 1.0),
        vec4(0.3, 0.3, 1.0, 1.0),
        vec4(0.2, 0.2, 1.0, 1.0),
        vec4(0.1, 0.1, 1.0, 1.0)
    ];

    for (let b = 0; b < numBubbles; b++) {
        let numTriangles = getRandomInt(6, 20);
        let radius = Math.random() * 0.1 + 0.05;

        let center = vec2(
            Math.random() * 2 - 1,  // x in range [-1, 1]
            Math.random() * 2 - 1   // y in range [-1, 1]
        );

        for (let i = 0; i < numTriangles; i++) {
            let angle1 = 2 * Math.PI * i / numTriangles;
            let angle2 = 2 * Math.PI * (i + 1) / numTriangles;

            let p1 = vec2(
                center[0] + radius * Math.cos(angle1),
                center[1] + radius * Math.sin(angle1)
            );

            let p2 = vec2(
                center[0] + radius * Math.cos(angle2),
                center[1] + radius * Math.sin(angle2)
            );

            let color = colorPalette[(i + b) % colorPalette.length];
            triangle(center, p1, p2, color);
        }
    }


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    var colorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    render();
};

function triangle(a, b, c, color)
{
    positions.push(a, b, c);
    colors.push(color, color, color);
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, positions.length );
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
