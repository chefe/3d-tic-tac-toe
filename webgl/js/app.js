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
        if (this.hasPlayerWon(0)) {
            setTimeout(function() { alert("Player 1 is the winner"); }, 100);
            return true;
        }

        if (this.hasPlayerWon(1)) {
            setTimeout(function() { alert("Player 2 is the winner"); }, 100);
            return true;
        }

        return false;
    },
    hasPlayerWon: function (player) {
        var played = Array(27).fill(0);
        this.playerData[player].forEach(function (element) {
            let index = (element[0][0] + 1) + 3 * (element[0][1] + 1) + 9 * (element[0][2] + 1);
            played[index] = 1;
        });

        var won = false;

        // check if has line in first axis
        for (var i = 0; i < 9; i++) {
            if (played[i] == 1 && played[i + 9] && played[i + 18]) {
                won = true;
            }
        }

        // check if has line in second axis
        for (var i = 0; i < 9; i++) {
            if (played[i * 3] == 1 && played[i * 3 + 1] && played[i * 3 + 2]) {
                won = true;
            }
        }

        // check if has line in third axis
        for (var i = 0; i < 9; i++) {
            let base = Math.floor(i / 3) * 9 + i % 3;
            if (played[base] == 1 && played[base + 3] && played[base + 6]) {
                won = true;
            }
        }
        
        // check if has diagonal line throug cube
        [0, 2, 6, 8].forEach(function (n) {
            if (played[n] == 1 && played[13] == 1 && played[26 - n] == 1) {
                won = true;
            }
        })

        // check if has line in first axis planes
        for (var i = 0; i < 3; i++) {
            let base = i * 9;
            let check1 = played[base] == 1 && played[base + 4] == 1 && played[base + 8] == 1;
            let check2 = played[base + 2] == 1 && played[base + 4] == 1 && played[base + 6] == 1;
            if (check1 || check2) {
                won = true;
            }
        }

        // check if has line in second axis planes
        for (var i = 0; i < 3; i++) {
            let check1 = played[i] == 1 && played[i + 12] == 1 && played[i + 24] == 1;
            let check2 = played[i + 6] == 1 && played[i + 12] == 1 && played[i + 18] == 1;
            if (check1 || check2) {
                won = true;
            }
        }

        // check if has line in third axis planes
        for (var i = 0; i < 3; i++) {
            let check1 = played[i * 3] == 1 && played[10 + i * 3] == 1 && played[20 + i * 3] == 1;
            let check2 = played[2 + i * 3] == 1 && played[10 + i * 3] == 1 && played[18 + i * 3] == 1;
            if (check1 || check2) {
                won = true;
            }
        }

        return won;
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
        var activePlayerDisplay = document.querySelector('.activePlayer');
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

                Game.hasWon();

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
        activePlayerDisplay.innerHTML = "Player " + Game.activePlayer;

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
    gl.clearColor(1, 1, 1, 1);

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
    mat4.lookAt(viewMatrix, [10,-2,0], [0,-2,0], [0,0,1]);
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

    window.cubeRotationAngle = 0;
    var identityMatrix = mat4.create();
    mat4.identity(identityMatrix);

    var loop = function() {
        if (Game.withRotation) {
            window.cubeRotationAngle = (window.cubeRotationAngle + 0.05) % (2 * Math.PI)
        }

        var angel = window.cubeRotationAngle;

        gl.clearColor(1, 1, 1, 1); // Background
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        // Spheres
        gl.uniform1i(ctx.uEnableLightingId, true);

        Game.playerData[0].forEach(function(element) {
            let [x, y, z] = element[0];
            //y += (x == Game.activeCube[0]) ? 4 : 0;

            mat4.rotate(modelMatrix, identityMatrix, angel, [0,0,1]);
            mat4.translate(modelMatrix,modelMatrix, [x, y, z]);
            gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrix);
            mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
            mat3.normalFromMat4(normalMatrix, modelViewMatrix);
            gl.uniformMatrix3fv(ctx.uNormalMatrixId,false,normalMatrix);

            solidSphere.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId, ctx.aNormalVertexId, player1.color);
        });

        Game.playerData[1].forEach(function(element) {
            let [x, y, z] = element[0];
            //y += (x == Game.activeCube[0]) ? 4 : 0;

            mat4.rotate(modelMatrix, identityMatrix, angel, [0,0,1]);
            mat4.translate(modelMatrix,modelMatrix, [x, y, z]);
            gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrix);
            mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
            mat3.normalFromMat4(normalMatrix, modelViewMatrix);
            gl.uniformMatrix3fv(ctx.uNormalMatrixId,false,normalMatrix);

            solidSphere.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId, ctx.aNormalVertexId, player2.color);
        });
        gl.uniform1i(ctx.uEnableLightingId, false);


        // GRID
        mat4.rotate(modelMatrix, identityMatrix, angel, [0,0,1]);
        var modelMatrixTmp = mat4.create();
        mat4.copy(modelMatrixTmp, modelMatrix);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrix);

        drawGridCube(Game.activeCube, false, modelMatrix, modelMatrixTmp, wiredCube_mmm);
        for (var x = -1; x < 2; x++) {
            for (var y = -1; y < 2; y++) {
                for (var z = -1; z < 2; z++) {
                    drawGridCube([x, y, z], true, modelMatrix, modelMatrixTmp, wiredCube_mmm)
                }
            }
        }

        // DRAW ONE LAYER REPRESENTATION
        mat4.identity(modelMatrix);
        mat4.identity(modelMatrixTmp);
        drawGridCube([0, Game.activeCube[1], Game.activeCube[2]], false, modelMatrix, modelMatrixTmp, wiredCube_mmm, true);
        for (var y = -1; y < 2; y++) {
            for (var z = -1; z < 2; z++) {
                drawGridCube([0, y, z], true, modelMatrix, modelMatrixTmp, wiredCube_mmm, true)
            }
        }

        // Spheres
        gl.uniform1i(ctx.uEnableLightingId, true);

        Game.playerData[0].forEach(function(element) {
            let [x, y, z] = element[0];
            if (x == Game.activeCube[0]) {
                mat4.identity(modelMatrix);
                mat4.translate(modelMatrix,modelMatrix, [0, y - 5, z]);
                gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrix);
                mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
                mat3.normalFromMat4(normalMatrix, modelViewMatrix);
                gl.uniformMatrix3fv(ctx.uNormalMatrixId,false,normalMatrix);

                solidSphere.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId, ctx.aNormalVertexId, player1.color);
            }
        });

        Game.playerData[1].forEach(function(element) {
            let [x, y, z] = element[0];
            if (x == Game.activeCube[0]) {
                mat4.identity(modelMatrix);
                mat4.translate(modelMatrix,modelMatrix, [0, y - 5, z]);
                gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrix);
                mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
                mat3.normalFromMat4(normalMatrix, modelViewMatrix);
                gl.uniformMatrix3fv(ctx.uNormalMatrixId,false,normalMatrix);

                solidSphere.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId, ctx.aNormalVertexId, player2.color);
            }
        });
        gl.uniform1i(ctx.uEnableLightingId, false);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}

function drawGridCube(position, preventActiveCube, modelMatrix, modelMatrixTmp, wiredCube_mmm, isSideRepresentation=false) {
    let [x, y, z] = position;
    let isActiveLayer = Game.activeCube[0] == x || isSideRepresentation;
    let isActiveCube = isActiveLayer && Game.activeCube[1] == y &&  Game.activeCube[2] == z;
    var color = (isActiveLayer && !isSideRepresentation) ? [0.7, 0.3, 0, 0.7] : [0.7, 0.7, 0.7, 0.7];
    color = isActiveCube ? [0.7, 0, 0, 0.7] : color;
    let pos = [x, y, z];
    pos[1] += isSideRepresentation ? -5 : 0;

    if (preventActiveCube == false || isActiveCube == false) {
        mat4.translate(modelMatrixTmp, modelMatrix, pos);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrixTmp);
        wiredCube_mmm.draw(gl, ctx.aVertexPositionId, ctx.aColorPositionId, color);
    }
}

window.onload = function () {

    document.querySelector('#start-game').addEventListener('click', function (event) {

        Loading.toggle(false);
        //Game.audio('ON');
        Game.withRotation = true;
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

