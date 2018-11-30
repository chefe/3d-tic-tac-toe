//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,

    aVertexPositionId: -1,
    aColorPositionId: -1,
    aNormalVertexId: -1,
    aVertexTexturCoordId: -1,
    uEnableTextureId: -1,
    uEnableLightingId: -1,
    uLightPositionId: -1,
    uLightColorId: -1,
    uSamplerId: -1,
    uViewMatrixId: -1,
    uModelMatrixId: -1,
    uProjectionMatrixId: -1,
    uNormalMatrixId: -1
};

var player1 = {
    color: [1, 1, 0],
    points: [[0,0,1], [1,1,-1], [-1,-1,1]]
};

var player2 = {
    color: [1, 0, 1],
    points: [[0,1,-1], [-1,-1,-1]]
};



var vertices = {
    mmm: [
        // back
        -0.5,-0.5,-0.5, //v0
        -0.5,0.5,-0.5,  //v1
        -0.5,0.5,0.5,   //v2
        -0.5,-0.5,0.5,  //v3

        //mront
        0.5,-0.5,-0.5,  //v4
        0.5,0.5,-0.5,   //v5
        0.5,0.5,0.5,    //v6
        0.5,-0.5,0.5    //v7
    ]
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    draw();
}


/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();
    gl.clearColor(0.5, 0.5, 0.5, 1);

    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
    "use strict";

    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aColorPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aNormalVertexId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");
    ctx.aVertexTexturCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");

    ctx.uEnableTextureId = gl.getUniformLocation(ctx.shaderProgram, "uEnableTexture");
    ctx.uEnableLightingId = gl.getUniformLocation(ctx.shaderProgram, "uEnableLighting");
    ctx.uLightPositionId = gl.getUniformLocation(ctx.shaderProgram, "uLightPosition");
    ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
    ctx.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
    ctx.uViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uViewMatrix");
    ctx.uModelMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelMatrix");
    ctx.uProjectionMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMatrix");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
    "use strict";
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");

    gl.uniform1i(ctx.uEnableLightingId, true);
    gl.uniform1i(ctx.uEnableTextureId, false);
    gl.uniform3fv(ctx.uLightPositionId, [10,10,10]);
    gl.uniform3fv(ctx.uLightColorId, [0.8,0.8,0.8]);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    var modelMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();
    mat4.identity(modelMatrix);
    //mat4.translate(modelMatrix, modelMatrix, [-1,0,0]);
    mat4.lookAt(viewMatrix, [6,2,0], [0,0,0], [0,0,1]);
    mat4.perspective(projectionMatrix, glMatrix.toRadian(45), gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000.0);

    gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrix);
    gl.uniformMatrix4fv(ctx.uViewMatrixId, false, viewMatrix);
    gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, projectionMatrix);


    var normalMatrix = mat3.create();
    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId,false,normalMatrix);


    // definition front
    var wiredCube_mmm = new WireFrameCube(gl, vertices.mmm);

    var solidSphere = new SolidSphere(gl, 60, 60);


    var angel = 0;
    var identityMatrix = mat4.create();
    mat4.identity(identityMatrix);
    var loop = function() {
        //angel = performance.now() / 1000 / 6 * 2 * Math.PI;

        gl.clearColor(0.5, 0.5, 0.5, 1);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        // Spheres
        gl.uniform1i(ctx.uEnableLightingId, true);

        player1.points.forEach(function(element) {
            mat4.rotate(modelMatrix, identityMatrix, angel, [0,0,1]);
            mat4.translate(modelMatrix,modelMatrix, element);
            gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrix);
            mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
            mat3.normalFromMat4(normalMatrix, modelViewMatrix);
            gl.uniformMatrix3fv(ctx.uNormalMatrixId,false,normalMatrix);

            solidSphere.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId, ctx.aNormalVertexId, player1.color);
        });

        player2.points.forEach(function(element) {
            mat4.rotate(modelMatrix, identityMatrix, angel, [0,0,1]);
            mat4.translate(modelMatrix,modelMatrix, element);
            gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrix);
            mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
            mat3.normalFromMat4(normalMatrix, modelViewMatrix);
            gl.uniformMatrix3fv(ctx.uNormalMatrixId,false,normalMatrix);

            solidSphere.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId, ctx.aNormalVertexId, player2.color);
        });
        gl.uniform1i(ctx.uEnableLightingId, false);


        // GRIDE

        mat4.rotate(modelMatrix, identityMatrix, angel, [0,0,1]);

        var modelMatrixTmp = mat4.create();
        mat4.copy(modelMatrixTmp, modelMatrix);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrix);

        // draw middle cube
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);


        // middle
        mat4.translate(modelMatrixTmp, modelMatrix, [0,-1,1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [0,0,1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [0,1,1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);

        mat4.translate(modelMatrixTmp, modelMatrix, [0,-1,0]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [0,1,0]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);

        mat4.translate(modelMatrixTmp, modelMatrix, [0,-1,-1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [0,0,-1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [0,1,-1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);


        // back
        mat4.translate(modelMatrixTmp, modelMatrix, [-1,-1,1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [-1,0,1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [-1,1,1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);

        mat4.translate(modelMatrixTmp, modelMatrix, [-1,-1,0]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [-1,0,0]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [-1,1,0]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);

        mat4.translate(modelMatrixTmp, modelMatrix, [-1,-1,-1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [-1,0,-1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [-1,1,-1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);


        // front
        mat4.translate(modelMatrixTmp, modelMatrix, [1,-1,1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [1,0,1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [1,1,1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);

        mat4.translate(modelMatrixTmp, modelMatrix, [1,-1,0]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [1,-0,0]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [1,1,0]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);

        mat4.translate(modelMatrixTmp, modelMatrix, [1,-1,-1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [1,0,-1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        mat4.translate(modelMatrixTmp, modelMatrix, [1,1,-1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);


        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

}