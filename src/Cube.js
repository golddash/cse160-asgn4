class Cube {
  constructor() {
    this.type = "cube";
    //this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    //this.size = 5.0;
    //this.segments = 10;
    this.matrix = new Matrix4();
    //this.normalMatrix = new Matrix4();
    this.textureNum=-1;
    this.cubeVerts32 = new Float32Array([
      // Front face
      0,0,0, 1,1,0, 1,0,0,
      0,0,0, 0,1,0, 1,1,0,
      // Back face
      0,0,1, 1,1,1, 1,0,1,
      0,0,1, 0,1,1, 1,1,1,
      // Top face
      0,1,0, 0,1,1, 1,1,1,
      0,1,0, 1,1,1, 1,1,0,
      // Bottom face
      0,0,0, 0,0,1, 1,0,1,
      0,0,0, 1,0,1, 1,0,0,
      // Right face
      1,0,0, 1,1,0, 1,1,1,
      1,0,0, 1,1,1, 1,0,1,
      // Left face
      0,0,0, 0,1,0, 0,1,1,
      0,0,0, 0,1,1, 0,0,1
    ]);

    this.allVerts = [
      // Front face
      0, 0, 0, 1, 1, 0, 1, 0, 0,
      0, 0, 0, 0, 1, 0, 1, 1, 0,
      // Back face
      0, 0, 1, 1, 1, 1, 1, 0, 1,
      0, 0, 1, 0, 1, 1, 1, 1, 1,
      // Top face
      0, 1, 0, 0, 1, 1, 1, 1, 1,
      0, 1, 0, 1, 1, 1, 1, 1, 0,
      // Bottom face
      0, 0, 0, 0, 0, 1, 1, 0, 1,
      0, 0, 0, 1, 0, 1, 1, 0, 0,
      // Right face
      1, 0, 0, 1, 1, 0, 1, 1, 1,
      1, 0, 0, 1, 1, 1, 1, 0, 1,
      // Left face
      0, 0, 0, 0, 1, 0, 0, 1, 1,
      0, 0, 0, 0, 1, 1, 0, 0, 1
    ];
    this.allUVs = [
      // Front face
      0, 0, 1, 1, 1, 0,
      0, 0, 0, 1, 1, 1,
      // Back face
      1, 0, 0, 1, 0, 0,
      1, 0, 1, 1, 0, 1,
      // Top face
      0, 0, 0, 1, 1, 1,
      0, 0, 1, 1, 1, 0,
      // Bottom face
      0, 1, 0, 0, 1, 0,
      0, 1, 1, 0, 1, 1,
      // Right face
      0, 0, 0, 1, 1, 1,
      0, 0, 1, 1, 1, 0,
      // Left face
      1, 0, 1, 1, 0, 1,
      1, 0, 0, 1, 0, 0
    ];
  }

  // render() {
  //   //var xy = this.position;
  //   var rgba = this.color;
  //   //var size = this.size;
  //   //console.log(this.textureNum);
  //   gl.uniform1i(u_whichTexture, this.textureNum);
  //   // Pass the color of a point to u_FragColor variable
  //   gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

  //   gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

  //   //front of cubes
  //   drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
  //   drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);

  //   //back of cube
  //   drawTriangle3DUV([0,0,1, 1,1,1, 1,0,1], [1,0, 0,1, 0,0]);
  //   drawTriangle3DUV([0,0,1, 0,1,1, 1,1,1], [1,0, 1,1, 0,1]);


  //   gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);

  //   //top of cube
  //   drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);
  //   drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0]);


  //   //bottom
  //   drawTriangle3DUV([0,0,0, 0,0,1, 1,0,1], [0,1, 0,0, 1,0]);
  //   drawTriangle3DUV([0,0,0, 1,0,1, 1,0,0], [0,1, 1,0, 1,1]);


  //   gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);

  //   //right side of cube
  //   drawTriangle3DUV([1,0,0, 1,1,0, 1,1,1], [0,0, 0,1, 1,1]);
  //   drawTriangle3DUV([1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]);

  //   //left side of cube
  //   drawTriangle3DUV([0,0,0, 0,1,0, 0,1,1], [1,0, 1,1, 0,1]);
  //   drawTriangle3DUV([0,0,0, 0,1,1, 0,0,1], [1,0, 0,1, 0,0]);

  // }

  render() {
    //var xy = this.position;
    var rgba = this.color;
    //var size = this.size;
    //console.log(this.textureNum);
    gl.uniform1i(u_whichTexture, this.textureNum);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    //gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
    
    //front ?
    drawTriangle3DUVNormal([0,0,0 , 1,1,0, 1,0,0],[1,0 , 0,1, 0,0],[0,0,-1 ,0,0,-1, 0,0,-1]);
    drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0], [1,0, 1,1, 0,1], [0,0, -1,0,0, -1, 0,0, -1]);

    //bottom
    drawTriangle3DUVNormal([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0]);
    drawTriangle3DUVNormal([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0]);


    //right side of cube
    drawTriangle3DUVNormal( [1,0,0, 1,1,1, 1,1,0], [1,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0] );
    drawTriangle3DUVNormal( [1,0,0, 1,1,1, 1,0,1], [1,0, 0,1, 0,0], [1,0,0, 1,0,0, 1,0,0] );
    
    //left side of cube
    //gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
    drawTriangle3DUVNormal( [0,0,0, 0,1,0, 0,0,1], [0,0, 0,1, 1,0], [-1,0,0, -1,0,0, -1,0,0] );
    drawTriangle3DUVNormal( [0,1,1, 0,1,0, 0,0,1], [1,1, 0,1, 1,0], [-1,0,0, -1,0,0, -1,0,0] );

    //top
    //gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
    drawTriangle3DUVNormal([0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);
    drawTriangle3DUVNormal([0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0], [0,-1,0, 0,-1,0, 0,-1,0]);

    //back of cube
    //gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);
    drawTriangle3DUVNormal( [0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0], [0,0,1, 0,0,1, 0,0,1] );
    drawTriangle3DUVNormal( [0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1] );
    
    
  }

  renderfast() {
    var rgba = this.color;
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    drawTriangle3DUV(this.allVerts, this.allUVs);
  }


  
}







