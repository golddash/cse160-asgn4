class Triangle {
    constructor() {
      this.type = "triangle";
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
    }
  
    render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
      // Pass the size of a point to u_Size variable
      gl.uniform1f(u_Size, size);
  
      // Draw
      //gl.drawArrays(gl.POINTS, 0, 1);
      var d = this.size / 200.0; // delta
      drawTriangle([xy[0], xy[1], xy[0] + d, xy[1], xy[0], xy[1] + d]);
    }
  }
  
  function drawTriangle(vertices) {
    //  var vertices = new Float32Array([
    //    0, 0.5,   -0.5, -0.5,   0.5, -0.5
    //  ]);
    var n = 3; // The number of vertices
  
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
    //return n;
  }
  
  function pictureTriangle(vertices, color) {
    // test added
    var n = 3; // The number of vertices
  
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    // Pass the color to the shader program
    gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  //var g_vertexBuffer = null;
  
  // function initTriangle3D() {
  //   g_vertexBuffer = gl.createBuffer();
  //   if (!g_vertexBuffer) {
  //     console.log("Failed to create the buffer object");
  //     return -1;
  //   }

  //   gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);
  //   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  //   gl.enableVertexAttribArray(a_Position);
  // }

  // function drawTriangle3D(vertices) {
  //   var n = vertices.length/3;
  //   if (g_vertexBuffer == null) {
  //     initTriangle3D();
  //   }

  //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  //   gl.drawArrays(gl.TRIANGLES, 0, n);
  // }


  function drawTriangle3D(vertices) {
    //  var vertices = new Float32Array([
    //    0, 0.5,   -0.5, -0.5,   0.5, -0.5
    //  ]);
    var n = 3; // The number of vertices
  
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
    //return n;
  }

  
  // function drawTriangle3DUV(vertices, uv) {

  //   var n = 3; // The number of vertices
    
  
  //   // Create a buffer object
  //   var vertexBuffer = gl.createBuffer();
  //   if (!vertexBuffer) {
  //     console.log("Failed to create the buffer object");
  //     return -1;
  //   }
  
  //   // Bind the buffer object to target
  //   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  //   // Write date into the buffer object
  //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  //   //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  //   // Assign the buffer object to a_Position variable
  //   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
  //   // Enable the assignment to a_Position variable
  //   gl.enableVertexAttribArray(a_Position);

  
  //   // Create a buffer object
  //   var uvBuffer = gl.createBuffer();
  //   if (!uvBuffer) {
  //     console.log("Failed to create the uv buffer object");
  //     return -1;
  //   }
  
  //   // Bind the buffer object to target
  //   gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  //   // Write date into the buffer object
  //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  //   //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  //   // Assign the buffer object to a_Position variable
  //   gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  
  //   // Enable the assignment to a_Position variable
  //   gl.enableVertexAttribArray(a_UV);

  
  //   gl.drawArrays(gl.TRIANGLES, 0, n);
    
  //   g_vertexBuffer = null;
  // }

  function drawTriangle3DUV(vertices, uv) {
    var n = vertices.length / 3; // The number of vertices

    // Convert vertices and uv arrays to Float32Array if they are not already
    if (!Array.isArray(vertices[0])) {
        vertices = new Float32Array(vertices);
    }
    if (!Array.isArray(uv[0])) {
        uv = new Float32Array(uv);
    }

    // Create a buffer object for vertices
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Create a buffer object for UV coordinates
    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
        console.log("Failed to create the uv buffer object");
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_UV variable
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_UV variable
    gl.enableVertexAttribArray(a_UV);

    // Draw the triangles
    gl.drawArrays(gl.TRIANGLES, 0, n);

    //g_vertexBuffer = null;
}

function drawTriangle3DUVNormal(vertices, uv, normals) {
  var n = vertices.length/3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  //create a buffer object for UV
  var uvBuffer = gl.createBuffer();
  if (!uvBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  //Bind the buffer object for UV
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  //Write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  //Assign the buffer object to a a_Position variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  //Enable the assigment to a_Position variable
  gl.enableVertexAttribArray(a_UV);

  var normalBuffer = gl.createBuffer();
  if(!normalBuffer) {
    console.log('Failed to create normal buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Normal);

  //draw triangle
  gl.drawArrays(gl.TRIANGLES, 0, n)

}