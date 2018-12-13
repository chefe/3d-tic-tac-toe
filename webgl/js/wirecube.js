/*
    Define a wire frame cube with methods for drawing it.

    * @param gl the webgl context
    * @param color the color of the cube
    * @returns object with draw method
    * @constructor
 */

function WireFrameCube(gl, vertices) {

    function defineVertices(gl, vertices) {

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        return buffer;
    }


    function defineColor(gl, color) {
        var colors = [];
        for (var x = 0; x < 8; x++) {
            colors.push(...color);
        }

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        return buffer;
    }

    function defineEdges(gl) {
        // Verbindung zwischen den Vertices
        var vertexIndices = [
            0,1,
            1,2,
            2,3,
            0,3,

            4,5,
            5,6,
            6,7,
            4,7,

            0,4,
            1,5,
            2,6,
            3,7
        ];

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);

        return buffer;
    }

    return {
        bufferVertices: defineVertices(gl, vertices),
        bufferEdges: defineEdges(gl),
        draw: function(gl, aVertexPositionId, aColorPositionId, color) {

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);

            gl.bindBuffer(gl.ARRAY_BUFFER, defineColor(gl, color));
            gl.vertexAttribPointer(aColorPositionId, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aColorPositionId);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferEdges);
            gl.drawElements(gl.LINES, 24 ,gl.UNSIGNED_SHORT, 0);

        }
    }
}