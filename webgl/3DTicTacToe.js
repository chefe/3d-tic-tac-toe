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


// t = top
// m = middle
// g = ground
// f = front
// b = back
// l = left
// r = right
var vertices = {
    ftl: [
        // back
        0.5,-1.5,0.5, //v0
        0.5,-0.5,0.5,  //v1
        0.5,-0.5,1.5,   //v2
        0.5,-1.5,1.5,  //v3

        //mront
        1.5,-1.5,0.5,  //v4
        1.5,-0.5,0.5,   //v5
        1.5,-0.5,1.5,    //v6
        1.5,-1.5,1.5    //v7
    ],
    ftm: [
        // back
        0.5,-0.5,0.5, //v0
        0.5,0.5,0.5,  //v1
        0.5,0.5,1.5,   //v2
        0.5,-0.5,1.5,  //v3

        //mront
        1.5,-0.5,0.5,  //v4
        1.5,0.5,0.5,   //v5
        1.5,0.5,1.5,    //v6
        1.5,-0.5,1.5    //v7
    ],
    ftr: [
        // back
        0.5,0.5,0.5, //v0
        0.5,1.5,0.5,  //v1
        0.5,1.5,1.5,   //v2
        0.5,0.5,1.5,  //v3

        //mront
        1.5,0.5,0.5,  //v4
        1.5,1.5,0.5,   //v5
        1.5,1.5,1.5,    //v6
        1.5,0.5,1.5    //v7
    ],
    fml: [
        // back
        0.5,-1.5,-0.5, //v0
        0.5,-0.5,-0.5,  //v1
        0.5,-0.5,0.5,   //v2
        0.5,-1.5,0.5,  //v3

        //mront
        1.5,-1.5,-0.5,  //v4
        1.5,-0.5,-0.5,   //v5
        1.5,-0.5,0.5,    //v6
        1.5,-1.5,0.5    //v7
    ],
    fmm: [
        // back
        0.5,-0.5,-0.5, //v0
        0.5,0.5,-0.5,  //v1
        0.5,0.5,0.5,   //v2
        0.5,-0.5,0.5,  //v3

        //mront
        1.5,-0.5,-0.5,  //v4
        1.5,0.5,-0.5,   //v5
        1.5,0.5,0.5,    //v6
        1.5,-0.5,0.5    //v7
    ],
    fmr: [
        // back
        0.5,0.5,-0.5, //v0
        0.5,1.5,-0.5,  //v1
        0.5,1.5,0.5,   //v2
        0.5,0.5,0.5,  //v3

        //mront
        1.5,0.5,-0.5,  //v4
        1.5,1.5,-0.5,   //v5
        1.5,1.5,0.5,    //v6
        1.5,0.5,0.5    //v7
    ],
    fgl: [
        // back
        0.5,-1.5,-1.5, //v0
        0.5,-0.5,-1.5,  //v1
        0.5,-0.5,-0.5,   //v2
        0.5,-1.5,-0.5,  //v3

        //mront
        1.5,-1.5,-1.5,  //v4
        1.5,-0.5,-1.5,   //v5
        1.5,-0.5,-0.5,    //v6
        1.5,-1.5,-0.5    //v7
    ],
    fgm: [
        // back
        0.5,-0.5,-1.5, //v0
        0.5,0.5,-1.5,  //v1
        0.5,0.5,-0.5,   //v2
        0.5,-0.5,-0.5,  //v3

        //mront
        1.5,-0.5,-1.5,  //v4
        1.5,0.5,-1.5,   //v5
        1.5,0.5,-0.5,    //v6
        1.5,-0.5,-0.5    //v7
    ],
    fgr: [
        // back
        0.5,0.5,-1.5, //v0
        0.5,1.5,-1.5,  //v1
        0.5,1.5,-0.5,   //v2
        0.5,0.5,-0.5,  //v3

        //mront
        1.5,0.5,-1.5,  //v4
        1.5,1.5,-1.5,   //v5
        1.5,1.5,-0.5,    //v6
        1.5,0.5,-0.5    //v7
    ],





    mtl: [
        // back
        -0.5,-1.5,0.5, //v0
        -0.5,-0.5,0.5,  //v1
        -0.5,-0.5,1.5,   //v2
        -0.5,-1.5,1.5,  //v3

        //mront
        0.5,-1.5,0.5,  //v4
        0.5,-0.5,0.5,   //v5
        0.5,-0.5,1.5,    //v6
        0.5,-1.5,1.5    //v7
    ],
    mtm: [
        // back
        -0.5,-0.5,0.5, //v0
        -0.5,0.5,0.5,  //v1
        -0.5,0.5,1.5,   //v2
        -0.5,-0.5,1.5,  //v3

        //mront
        0.5,-0.5,0.5,  //v4
        0.5,0.5,0.5,   //v5
        0.5,0.5,1.5,    //v6
        0.5,-0.5,1.5    //v7
    ],
    mtr: [
        // back
        -0.5,0.5,0.5, //v0
        -0.5,1.5,0.5,  //v1
        -0.5,1.5,1.5,   //v2
        -0.5,0.5,1.5,  //v3

        //mront
        0.5,0.5,0.5,  //v4
        0.5,1.5,0.5,   //v5
        0.5,1.5,1.5,    //v6
        0.5,0.5,1.5    //v7
    ],
    mml: [
        // back
        -0.5,-1.5,-0.5, //v0
        -0.5,-0.5,-0.5,  //v1
        -0.5,-0.5,0.5,   //v2
        -0.5,-1.5,0.5,  //v3

        //mront
        0.5,-1.5,-0.5,  //v4
        0.5,-0.5,-0.5,   //v5
        0.5,-0.5,0.5,    //v6
        0.5,-1.5,0.5    //v7
    ],
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
    ],
    mmr: [
        // back
        -0.5,0.5,-0.5, //v0
        -0.5,1.5,-0.5,  //v1
        -0.5,1.5,0.5,   //v2
        -0.5,0.5,0.5,  //v3

        //mront
        0.5,0.5,-0.5,  //v4
        0.5,1.5,-0.5,   //v5
        0.5,1.5,0.5,    //v6
        0.5,0.5,0.5    //v7
    ],
    mgl: [
        // back
        -0.5,-1.5,-1.5, //v0
        -0.5,-0.5,-1.5,  //v1
        -0.5,-0.5,-0.5,   //v2
        -0.5,-1.5,-0.5,  //v3

        //mront
        0.5,-1.5,-1.5,  //v4
        0.5,-0.5,-1.5,   //v5
        0.5,-0.5,-0.5,    //v6
        0.5,-1.5,-0.5    //v7
    ],
    mgm: [
        // back
        -0.5,-0.5,-1.5, //v0
        -0.5,0.5,-1.5,  //v1
        -0.5,0.5,-0.5,   //v2
        -0.5,-0.5,-0.5,  //v3

        //mront
        0.5,-0.5,-1.5,  //v4
        0.5,0.5,-1.5,   //v5
        0.5,0.5,-0.5,    //v6
        0.5,-0.5,-0.5    //v7
    ],
    mgr: [
        // back
        -0.5,0.5,-1.5, //v0
        -0.5,1.5,-1.5,  //v1
        -0.5,1.5,-0.5,   //v2
        -0.5,0.5,-0.5,  //v3

        //mront
        0.5,0.5,-1.5,  //v4
        0.5,1.5,-1.5,   //v5
        0.5,1.5,-0.5,    //v6
        0.5,0.5,-0.5    //v7
    ],




    btl: [
        // back
        -1.5,-1.5,0.5, //v0
        -1.5,-0.5,0.5,  //v1
        -1.5,-0.5,1.5,   //v2
        -1.5,-1.5,1.5,  //v3

        //mront
        -0.5,-1.5,0.5,  //v4
        -0.5,-0.5,0.5,   //v5
        -0.5,-0.5,1.5,    //v6
        -0.5,-1.5,1.5    //v7
    ],
    btm: [
        // back
        -1.5,-0.5,0.5, //v0
        -1.5,0.5,0.5,  //v1
        -1.5,0.5,1.5,   //v2
        -1.5,-0.5,1.5,  //v3

        //mront
        -0.5,-0.5,0.5,  //v4
        -0.5,0.5,0.5,   //v5
        -0.5,0.5,1.5,    //v6
        -0.5,-0.5,1.5    //v7
    ],
    btr: [
        // back
        -1.5,0.5,0.5, //v0
        -1.5,1.5,0.5,  //v1
        -1.5,1.5,1.5,   //v2
        -1.5,0.5,1.5,  //v3

        //mront
        -0.5,0.5,0.5,  //v4
        -0.5,1.5,0.5,   //v5
        -0.5,1.5,1.5,    //v6
        -0.5,0.5,1.5    //v7
    ],
    bml: [
        // back
        -1.5,-1.5,-0.5, //v0
        -1.5,-0.5,-0.5,  //v1
        -1.5,-0.5,0.5,   //v2
        -1.5,-1.5,0.5,  //v3

        //mront
        -0.5,-1.5,-0.5,  //v4
        -0.5,-0.5,-0.5,   //v5
        -0.5,-0.5,0.5,    //v6
        -0.5,-1.5,0.5    //v7
    ],
    bmm: [
        // back
        -1.5,-0.5,-0.5, //v0
        -1.5,0.5,-0.5,  //v1
        -1.5,0.5,0.5,   //v2
        -1.5,-0.5,0.5,  //v3

        //mront
        -0.5,-0.5,-0.5,  //v4
        -0.5,0.5,-0.5,   //v5
        -0.5,0.5,0.5,    //v6
        -0.5,-0.5,0.5    //v7
    ],
    bmr: [
        // back
        -1.5,0.5,-0.5, //v0
        -1.5,1.5,-0.5,  //v1
        -1.5,1.5,0.5,   //v2
        -1.5,0.5,0.5,  //v3

        //mront
        -0.5,0.5,-0.5,  //v4
        -0.5,1.5,-0.5,   //v5
        -0.5,1.5,0.5,    //v6
        -0.5,0.5,0.5    //v7
    ],
    bgl: [
        // back
        -1.5,-1.5,-1.5, //v0
        -1.5,-0.5,-1.5,  //v1
        -1.5,-0.5,-0.5,   //v2
        -1.5,-1.5,-0.5,  //v3

        //mront
        -0.5,-1.5,-1.5,  //v4
        -0.5,-0.5,-1.5,   //v5
        -0.5,-0.5,-0.5,    //v6
        -0.5,-1.5,-0.5    //v7
    ],
    bgm: [
        // back
        -1.5,-0.5,-1.5, //v0
        -1.5,0.5,-1.5,  //v1
        -1.5,0.5,-0.5,   //v2
        -1.5,-0.5,-0.5,  //v3

        //mront
        -0.5,-0.5,-1.5,  //v4
        -0.5,0.5,-1.5,   //v5
        -0.5,0.5,-0.5,    //v6
        -0.5,-0.5,-0.5    //v7
    ],
    bgr: [
        // back
        -1.5,0.5,-1.5, //v0
        -1.5,1.5,-1.5,  //v1
        -1.5,1.5,-0.5,   //v2
        -1.5,0.5,-0.5,  //v3

        //mront
        -0.5,0.5,-1.5,  //v4
        -0.5,1.5,-1.5,   //v5
        -0.5,1.5,-0.5,    //v6
        -0.5,0.5,-0.5    //v7
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
    var wiredCube_ftl = new WireFrameCube(gl, vertices.ftl);
    var wiredCube_ftm = new WireFrameCube(gl, vertices.ftm);
    var wiredCube_ftr = new WireFrameCube(gl, vertices.ftr);
    var wiredCube_fml = new WireFrameCube(gl, vertices.fml);
    var wiredCube_fmm = new WireFrameCube(gl, vertices.fmm);
    var wiredCube_fmr = new WireFrameCube(gl, vertices.fmr);
    var wiredCube_fgl = new WireFrameCube(gl, vertices.fgl);
    var wiredCube_fgm = new WireFrameCube(gl, vertices.fgm);
    var wiredCube_fgr = new WireFrameCube(gl, vertices.fgr);

    // definition middle
    var wiredCube_mtl = new WireFrameCube(gl, vertices.mtl);
    var wiredCube_mtm = new WireFrameCube(gl, vertices.mtm);
    var wiredCube_mtr = new WireFrameCube(gl, vertices.mtr);
    var wiredCube_mml = new WireFrameCube(gl, vertices.mml);
    var wiredCube_mmm = new WireFrameCube(gl, vertices.mmm);
    var wiredCube_mmr = new WireFrameCube(gl, vertices.mmr);
    var wiredCube_mgl = new WireFrameCube(gl, vertices.mgl);
    var wiredCube_mgm = new WireFrameCube(gl, vertices.mgm);
    var wiredCube_mgr = new WireFrameCube(gl, vertices.mgr);

    // definition back
    var wiredCube_btl = new WireFrameCube(gl, vertices.btl);
    var wiredCube_btm = new WireFrameCube(gl, vertices.btm);
    var wiredCube_btr = new WireFrameCube(gl, vertices.btr);
    var wiredCube_bml = new WireFrameCube(gl, vertices.bml);
    var wiredCube_bmm = new WireFrameCube(gl, vertices.bmm);
    var wiredCube_bmr = new WireFrameCube(gl, vertices.bmr);
    var wiredCube_bgl = new WireFrameCube(gl, vertices.bgl);
    var wiredCube_bgm = new WireFrameCube(gl, vertices.bgm);
    var wiredCube_bgr = new WireFrameCube(gl, vertices.bgr);

    var solidSphere = new SolidSphere(gl, 60, 60);


    var angel = 0;
    var identityMatrix = mat4.create();
    mat4.identity(identityMatrix);
    var loop = function() {
        angel = performance.now() / 1000 / 6 * 2 * Math.PI;

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
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrix);

        // draw middle
        wiredCube_ftl.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_ftm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_ftr.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_fml.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_fmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_fmr.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_fgl.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_fgm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_fgr.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);

        // draw middle
        wiredCube_mtl.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_mtm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_mtr.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_mml.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_mmr.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_mgl.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_mgm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_mgr.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);

        // draw middle
        wiredCube_btl.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_btm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_btr.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_bml.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_bmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_bmr.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_bgl.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_bgm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);
        wiredCube_bgr.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

}