"use strict";

var canvas;
var gl;

var positions = [];
var colors = [];

var numTimesToSubdivide = 5;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three positions.

    var numTriangles = 6; // increase for smoother circle
    var radius = 1.0;
    var center = vec2(0, 0);

    var colorPalette = [
        vec4(1.0, 0.0, 0.0, 1.0), // red
        vec4(0.0, 1.0, 0.0, 1.0), // green
        vec4(0.0, 0.0, 1.0, 1.0), // blue
        vec4(1.0, 1.0, 0.0, 1.0), // yellow
        vec4(1.0, 0.0, 1.0, 1.0), // magenta
        vec4(0.0, 1.0, 1.0, 1.0)
    ]

    for (let i = 0; i < numTriangles; i++) {
        let angle1 = 2 * Math.PI * i / numTriangles;
        let angle2 = 2 * Math.PI * (i + 1) / numTriangles;

        let p1 = vec2(radius * Math.cos(angle1), radius * Math.sin(angle1));
        let p2 = vec2(radius * Math.cos(angle2), radius * Math.sin(angle2));

        positions.push(center, p1, p2);

        let color = colorPalette[i % colorPalette.length];
        colors.push(color, color, color);
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
