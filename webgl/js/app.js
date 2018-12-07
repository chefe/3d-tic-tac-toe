//
// Computer Graphics
//
// WebGL Exercises
//

// Register Game globally
var Game = {

    activeCube: [0, 0, 0], // also get active layer with cube coordinates
    activePlayer: 1,
    audioIsOn: false,
    playerData: [
        [], []
    ],
    reservedCubes: [],
    withRotation: false,

    activeCubeIsReserved: function () {

          for (var i = 0; i < this.reservedCubes.length; i++) {

              if (this.reservedCubes[i][0] === this.activeCube[0] &&
                  this.reservedCubes[i][1] === this.activeCube[1] &&
                  this.reservedCubes[i][2] === this.activeCube[2]) {

                  return true;

              }

          }

          return false;

    },
    audio: function (status) {

        var audio = document.querySelector('audio');

        if (!audio) { return false; }

        audio.load();

        if (status) {

            audio.play();
            return this.audioIsOn = true;

        }

        audio.pause();
        return this.audioIsOn = false;

    },
    hasWon: function () {

    },
    player: function (number) {

        if (number < 1 || number > 2) { return false; }
        return this.playerData[number - 1];

    },
    back: function () {

        if (this.activeCube[0] === -1) {
            return this.activeCube[0] = 1;
        }

        return this.activeCube[0] -= 1;

    },
    down: function () {

        if (this.activeCube[2] === -1) {
            return this.activeCube[2] = 1;
        }

        return this.activeCube[2] -= 1;

    },
    forwards: function () {

        if (this.activeCube[0] === 1) {
            return this.activeCube[0] = -1;
        }

        return this.activeCube[0] += 1;

    },
    left: function () {

        if (this.activeCube[1] === -1) {
            return this.activeCube[1] = 1;
        }

        return this.activeCube[1] -= 1;

    },
    right: function () {

        if (this.activeCube[1] === 1) {
            return this.activeCube[1] = -1;
        }

        return this.activeCube[1] += 1;

    },
    up: function () {

        if (this.activeCube[2] === 1) {
            return this.activeCube[2] = -1;
        }

        return this.activeCube[2] += 1;

    }

};

var Instructions = {

    areActive: false,
    toggle: function (areActive) {

        var question     = document.querySelector('.question');
        var close        = document.querySelector('.close');
        var instructions = document.querySelector('.instructions');

        if (!question) { return false; }
        if (!close) { return false; }
        if (!instructions) { return false; }

        if (!areActive) {

            question.classList.remove('active');
            close.classList.remove('active');
            close.classList.add('active');
            instructions.classList.remove('active');
            instructions.classList.add('active');

            return this.areActive = true;

        }

        close.classList.remove('active');
        question.classList.remove('active');
        question.classList.add('active');
        instructions.classList.remove('active');

        return this.areActive = false;

    }

};

var Loading = {
    isActive: false,
    toggle: function (isActive) {

        var loadingLightBox = document.querySelector('.loading');

        if (!loadingLightBox) {

            return false;

        }

        loadingLightBox.classList.remove('active');

        if (!isActive) {

            this.isActive = true;
            return loadingLightBox.classList.add('active');

        }

        this.isActive = false;
        return false;

    }
};

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
    color: [0.85, 0.71, 0.99] // Ball Colors
};

var player2 = {
    color: [0.99, 0.85, 0.71] // Ball Colors
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

    document.onkeypress = function (event) {

        var activeCubeDisplay = document.querySelector('.activeCube');
        var playerOneStats    = document.querySelector('.playerOneStats');
        var playerTwoStats    = document.querySelector('.playerTwoStats');

        event.stopImmediatePropagation();
        event.stopPropagation();

        switch (event.code) {

            case 'KeyI':
                Game.up();
                break;
            case 'KeyK':
                Game.down();
                break;
            case 'KeyJ':
                Game.left();
                break;
            case 'KeyL':
                Game.right();
                break;
            case 'KeyE':
                Game.back();
                break;
            case 'KeyD':
                Game.forwards();
                break;
            case 'Space':

                var newArray = [];

                if (Game.activeCubeIsReserved()) {

                    return alert('Already taken');

                }

                newArray.push([Game.activeCube[0], Game.activeCube[1], Game.activeCube[2]]);

                Game.playerData[Game.activePlayer - 1].push(newArray);
                (Game.activePlayer - 1) ? Game.activePlayer = 1 : Game.activePlayer = 2;
                Game.reservedCubes.push(newArray[0]);

                break;

            case 'KeyH':
                Instructions.toggle(Instructions.areActive);
                break;
            case 'KeyP':
                Game.audio(!Game.audioIsOn);
                break;
            case 'KeyR':
                Game.withRotation = !Game.withRotation;
                break;
        }

        if (!activeCubeDisplay) {

            return false;

        }

        activeCubeDisplay.innerHTML = Game.activeCube[0] + ", " + Game.activeCube[1] + ", " + Game.activeCube[2];

        if (!playerOneStats) { return false; }

        playerOneStats.innerHTML = "";
        playerTwoStats.innerHTML = "";

        for (var i = 0; i < Game.player(1).length; i ++) {

            var li1 = document.createElement('li');
            li1.innerHTML = "<li class='mt-2'><code>" + Game.player(1)[i] + "</code></li>";
            playerOneStats.appendChild(li1);

        }

        for (var j = 0; j < Game.player(2).length; j ++) {

            var li2 = document.createElement('li');
            li2.innerHTML = "<li class='mt-2'><code>" + Game.player(2)[j] + "</code></li>";
            playerTwoStats.appendChild(li2);

        }

    };

}


/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'shader/VertexShader.glsl', 'shader/FragmentShader.glsl');
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

        if (Game.withRotation) {

            angel = performance.now() / 1000 / 6 * 2 * Math.PI;

        }

        gl.clearColor(0.95, 0.96, 0.97, 1); // Background
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        // Spheres
        gl.uniform1i(ctx.uEnableLightingId, true);

        Game.playerData[0].forEach(function(element) {
            mat4.rotate(modelMatrix, identityMatrix, angel, [0,0,1]);
            mat4.translate(modelMatrix,modelMatrix, element[0]);
            gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrix);
            mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
            mat3.normalFromMat4(normalMatrix, modelViewMatrix);
            gl.uniformMatrix3fv(ctx.uNormalMatrixId,false,normalMatrix);

            solidSphere.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId, ctx.aNormalVertexId, player1.color);
        });

        Game.playerData[1].forEach(function(element) {
            mat4.rotate(modelMatrix, identityMatrix, angel, [0,0,1]);
            mat4.translate(modelMatrix,modelMatrix, element[0]);
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

        mat4.translate(modelMatrixTmp, modelMatrix, Game.activeCube);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId, [0.7, 0, 0, 0.7]);

        for (var x = -1; x < 2; x++) {
            for (var y = -1; y < 2; y++) {
                for (var z = -1; z < 2; z++) {
                    let isActiveCube = Game.activeCube[0] == x && Game.activeCube[1] == y &&  Game.activeCube[2] == z;
                    if (isActiveCube == false) {
                        mat4.translate(modelMatrixTmp, modelMatrix, [x,y,z]);
                        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
                        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId, [0.7, 0.7, 0.7, 0.7]);
                    }
                }
            }
        }

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}

window.onload = function () {

    document.querySelector('#start-game').addEventListener('click', function (event) {

        Loading.toggle(false);
        Game.audio('ON');
        Game.withRotation = false;
        startup();

        event.target.blur();
        setTimeout(function () {
            Loading.toggle(true);
        }, 100);


    });

    document.querySelector('.question').addEventListener('click', function (event) {

        Instructions.toggle(false);

    });

    document.querySelector('.close').addEventListener('click', function (event) {

        Instructions.toggle(true);

    });

    document.onkeypress = function (event) {

        event.stopImmediatePropagation();
        event.stopPropagation();

        switch (event.code) {

            case 'KeyH':
                Instructions.toggle(Instructions.areActive);
                break;

        }

    };

};

window.Game = Game;

