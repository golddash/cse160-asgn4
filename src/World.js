// Kevin Chen 4/28/24

var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    //v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    v_VertPos = u_ModelMatrix * a_Position;
   }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  void main() {
    if (u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);
    }
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    }
    else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    }
    else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } 
    else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } 
    else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } 
    else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    }
    else if (u_whichTexture == 4) {
      gl_FragColor = texture2D(u_Sampler4, v_UV);
    } 
    else if (u_whichTexture < -4 || u_whichTexture > 4) {
      gl_FragColor = vec4(1, 0.2, 0.2, 1.0); // Handle values less than -4 and greater than 4
    }

    //vec3 lightVector = vec3(v_VertPos) - u_lightPos;
    vec3 lightVector =  u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);

    // if (r <1.0) {
    //   gl_FragColor = vec4(1,0,0,1);
    // } else if (r < 2.0) {
    //   gl_FragColor = vec4(0,1,0,1);
    // }

    // N dot L
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N, L), 0.0);

    // Reflection
    vec3 R = reflect(-L, N);

    // eye
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    // Specular
    float specular = pow(max(dot(E,R), 0.0), 10.0);

    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.3;
    //gl_FragColor = vec4(specular + diffuse + ambient, 1.0);

    if (u_lightOn) {
      gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
    }

    
  }`;



let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

let a_UV;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_whichTexture;

let a_Normal;
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let u_NormalMatrix;



function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  // Get the storage location of a_Normal
  a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
  if (a_Normal < 0) {
    console.log("Failed to get the storage location of a_Normal");
    return;
  }

  // Get the storage Location of u_lightPos
  u_lightPos = gl.getUniformLocation(gl.program, "u_lightPos");
  if (!u_lightPos) {
    console.log("Failed to get the storage location of u_lightPos");
    return;
  }

  // Get the storage Location of u_cameraPos
  u_cameraPos = gl.getUniformLocation(gl.program, "u_cameraPos");
  if (!u_cameraPos) {
    console.log("Failed to get the storage location of u_cameraPos");
    return;
  }

  // Get the storage Location of u_lightOn
  u_lightOn = gl.getUniformLocation(gl.program, "u_lightOn");
  if (!u_lightOn) {
    console.log("Failed to get the storage location of u_lightOn");
    return;
  }

  // // Get the storage Location of u_NormalMatrix
  // u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
  // if (!u_NormalMatrix) {
  //   console.log("Failed to get the storage location of u_NormalMatrix");
  //   return;
  // }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get the storage location of u_ModelMatrix");
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(
    gl.program,
    "u_GlobalRotateMatrix"
  );
  if (!u_GlobalRotateMatrix) {
    console.log("Failed to get the storage location of u_GlobalRotateMatrix");
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, "a_UV");
  if (a_UV < 0) {
    console.log("Failed to get the storage location of a_UV");
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log("Failed to get the storage location of u_ViewMatrix");
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
  if (!u_ProjectionMatrix) {
    console.log("Failed to get the storage location of u_ProjectionMatrix");
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  if (!u_Sampler0) {
    console.log("Failed to get the storage location of u_Sampler0");
    return;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
  if (!u_Sampler1) {
    console.log("Failed to get the storage location of u_Sampler1");
    return;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, "u_Sampler2");
  if (!u_Sampler2) {
    console.log("Failed to get the storage location of u_Sampler2");
    return;
  }

  u_Sampler3 = gl.getUniformLocation(gl.program, "u_Sampler3");
  if (!u_Sampler3) {
    console.log("Failed to get the storage location of u_Sampler3");
    return;
  }

  u_Sampler4 = gl.getUniformLocation(gl.program, "u_Sampler4");
  if (!u_Sampler4) {
    console.log("Failed to get the storage location of u_Sampler4");
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
  if (!u_whichTexture) {
    console.log("Failed to get the storage location of u_whichTexture");
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Const
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global for UI
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_numSegments = 6;
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
g_yellowAnimation = false;
g_magentaAnimation = false;

g_leftArmAngle = 0;
g_rightArmAngle = 0;
g_leftHandAngle = 0;
g_rightHandAngle = 0;
g_leftLegAngle = 0;
g_rightLegAngle = 0;
g_tailAngle = 0;
g_leftEarAngle = 0;
g_rightEarAngle = 0;

g_leftArmAnimation = false;
g_leftHandAnimation = false;
g_rightArmAnimation = false;
g_rightHandAnimation = false;
g_tailAnimation = false;
g_leftEarAnimation = false;
g_rightEarAnimation = false;

g_globalAngleX = 0;
g_globalAngleZ = 0;


let oldMouseX = 0;
let oldMouseY = 0;

let g_normalOn = false;
let g_lightPos = [0,1,-2];
let g_lightOn = true;

function addActionsForHtmlUI() {

  // Button for normals
  document.getElementById("normalOn").onclick = function () {g_normalOn = true;};
  document.getElementById("normalOff").onclick = function () {g_normalOn = false;};

  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[0] = this.value/100; renderAllShapes();}});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[1] = this.value/100; renderAllShapes();}});
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[2] = this.value/100; renderAllShapes();}});

  document.getElementById('lightOff').onclick = function () {g_lightOn= false;};
  document.getElementById('lightOn').onclick = function () {g_lightOn= true;};


  // Camera angle
  document
    .getElementById("angleSlide")
    .addEventListener("mousemove", function () {
      g_globalAngle = this.value;
      renderAllShapes();
    });
    // Camera angle X
    document.getElementById("angleXSlide").addEventListener('mousemove', function () { g_globalAngleX = this.value; renderAllShapes(); });
    // Camera angle Z
    document.getElementById("angleZSlide").addEventListener('mousemove', function () { g_globalAngleZ = this.value; renderAllShapes(); });

  // Left arm slider
  document.getElementById("leftArmSlide").addEventListener("mousemove", function () {
    g_leftArmAngle = this.value;
    renderAllShapes();
  });

  // Feft arm button
  document.getElementById("leftArmOn").onclick = function () {
    g_leftArmAnimation = true;
  };

  document.getElementById("leftArmOff").onclick = function () {
    g_leftArmAnimation = false;
  };

  // Left hand slider
  document.getElementById("leftHandSlide").addEventListener("mousemove", function () {
    g_leftHandAngle = this.value;
    renderAllShapes();
  });

  // Left hand button
  document.getElementById("leftHandOn").onclick = function () {
    g_leftHandAnimation = true;
  };

  document.getElementById("leftHandOff").onclick = function () {
    g_leftHandAnimation = false;
  };
  
  // Right arm slider
  document.getElementById("rightArmSlide").addEventListener("mousemove", function () {
    g_rightArmAngle = this.value;
    renderAllShapes();
  });
  
  // Right arm button
  document.getElementById("rightArmOn").onclick = function () {
    g_rightArmAnimation = true;
  };
  
  document.getElementById("rightArmOff").onclick = function () {
    g_rightArmAnimation = false;
  };
  
  // Right hand slider
  document.getElementById("rightHandSlide").addEventListener("mousemove", function () {
    g_rightHandAngle = this.value;
    renderAllShapes();
  });

  // Right hand button
  document.getElementById("rightHandOn").onclick = function () {
    g_rightHandAnimation = true;
  };
  
  document.getElementById("rightHandOff").onclick = function () {
    g_rightHandAnimation = false;
  };
  
  // Tail slider
  document.getElementById("tailSlide").addEventListener("mousemove", function () {
    g_tailAngle = this.value;
    renderAllShapes();
  });

  // Tail button
  document.getElementById("tailOn").onclick = function () {
    g_tailAnimation = true;
  };
  document.getElementById("tailOff").onclick = function () {  
    g_tailAnimation = false;
  }

  // left ear slider
  document.getElementById("leftEarSlide").addEventListener("mousemove", function () {
    g_leftEarAngle = this.value;
    renderAllShapes();
  });

  // left ear button
  document.getElementById("leftEarOn").onclick = function () {
    g_leftEarAnimation = true;
  };
  document.getElementById("leftEarOff").onclick = function () {  
    g_leftEarAnimation = false;
  }
  
  // shift click

  canvas.addEventListener("click", function (ev) {
    if (ev.shiftKey) {
      g_tailAnimation = true;
      g_leftEarAnimation = true;
      
    }
  });


// This is the mouse movement event listener

//   document.getElementById("webgl").addEventListener('mousemove', function(event) {
//     const canvasRect = document.getElementById("webgl").getBoundingClientRect();
//     const mouseX = event.clientX - canvasRect.left;
//     const mouseY = event.clientY - canvasRect.top;

//     if (mouseX >= 0 && mouseX <= canvasRect.width && mouseY >= 0 && mouseY <= canvasRect.height) {
//         onMove(event);
//     }
// });


  document.getElementById("resetButton").addEventListener("click", function() {
    // Reset global angle variables to initial values
    g_globalAngle = 0;
    g_globalAngleX = 0;
    g_globalAngleZ = 0;

});

}


function onMove(event) {
  // Calculate the change in mouse position
  const deltaX = event.clientX - oldMouseX;
  const deltaY = event.clientY - oldMouseY;

  // Adjust rotation based on mouse movement
  g_camera.rotateY(-deltaX * 0.5); // Adjusting rotateY based on X movement
  g_camera.rotateX(-deltaY * 0.3); // Adjusting rotateX based on Y movement

  // Update old mouse position
  oldMouseX = event.clientX;
  oldMouseY = event.clientY;
}


function initTextures() {

  // image 0
  var image0 = new Image();
  if (!image0) {
    console.log("Failed to create the image 0 object");
    return false;
  }

  image0.onload = function() {sendImageToTEXTURE0 (image0, 0, u_Sampler0); };
  image0.src = "../images/car.jpg";
  console.log('created image0');

 // image 1
  var image1 = new Image();
  if (!image1) {
    console.log("Failed to create the image 1 object");
    return false;
  }

  image1.onload = function() {sendImageToTEXTURE0 (image1, 1, u_Sampler1); };
  image1.src = "../images/dark-wood-2048.jpg";
  console.log('created image1');

  // image 2

  var image2 = new Image();
  if (!image2) {
    console.log("Failed to create the image 2 object");
    return false;
  }

  image2.onload = function() {sendImageToTEXTURE0 (image2, 2, u_Sampler2); };
  image2.src = "../images/comet-1024.jpg";
  console.log('created image2');

  // image 3

  var image3 = new Image();
  if (!image3) {
    console.log("Failed to create the image 3 object");
    return false;
  }

  image3.onload = function() {sendImageToTEXTURE0 (image3, 3, u_Sampler3); };
  image3.src = "../images/hardwood-1024.jpg";
  console.log('created image3');


  // image 4

  var image4 = new Image();
  if (!image4) {
    console.log("Failed to create the image 4 object");
    return false;
  }

  image4.onload = function() {sendImageToTEXTURE0 (image4, 4, u_Sampler4); };
  image4.src = "../images/leaves-1024.jpg";
  console.log('created image4');
  return true;
}

function sendImageToTEXTURE0 (image, n, u_Sampler) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  
  }


  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  switch (n) {
    case 0:
      gl.activeTexture(gl.TEXTURE0);
      break;
    case 1:
      gl.activeTexture(gl.TEXTURE1);
      break;
    case 2:
      gl.activeTexture(gl.TEXTURE2);
      break;
    case 3:
      gl.activeTexture(gl.TEXTURE3);
      break;
    case 4:
      gl.activeTexture(gl.TEXTURE4);
      break;
  }
  //gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler, n);
  console.log('finished loadTexture');
}

let clickDown=false;


function main() {
  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;

  // Drag mouse to draw
  // canvas.onmousemove = function (ev) {
  //   if (ev.buttons == 1) {
  //     click(ev);
  //   }
  // };

  g_camera = new Camera();

  document.onkeydown = keydown;




  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //renderAllShapes();

  requestAnimationFrame(tick);
}

var g_shapeList = [];

function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);

  let point = new Point();

  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
    point.segments = g_numSegments;
  }

  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapeList.push(point);

  //renderAllShapes();
  
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return [x, y];
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick() {

  g_seconds = performance.now()/1000.0 - g_startTime;
  //console.log(g_seconds);
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);
}

function updateAnimationAngles()
{
  if (g_leftArmAnimation){
    g_leftArmAngle = 30 * Math.sin(g_seconds * 2 * Math.PI);
  }

  if (g_leftHandAnimation){
    g_leftHandAngle = 30 * Math.sin(g_seconds * 2 * Math.PI);
  }
  if (g_rightArmAnimation) {
    g_rightArmAngle = 30 * Math.sin(g_seconds * 2 * Math.PI);
  }
  
  if (g_rightHandAnimation) {
    g_rightHandAngle = 30 * Math.sin(g_seconds * 2 * Math.PI);
  }
  
  if (g_tailAnimation) {
    g_tailAngle = 30 * Math.sin(g_seconds * 2 * Math.PI);
  }

  if (g_leftEarAnimation) {
    g_leftEarAngle = 30 * Math.sin(g_seconds * 2 * Math.PI);
  }

  g_lightPos[0] = Math.cos(g_seconds);
  
}

function keydown(ev) {
  if (ev.keyCode == 68) {
    g_camera.eye.elements[0] += 0.2;
}
else if (ev.keyCode == 65) {
    g_camera.eye.elements[0] -= 0.2;
}
else if (ev.keyCode == 87) {
    g_camera.forward();
}
else if (ev.keyCode == 83) {
    g_camera.back();
}
else if (ev.keyCode == 81) {
    g_camera.panLeft();
}
else if (ev.keyCode == 69) {
    g_camera.panRight();
}
  renderAllShapes();
  console.log(ev.keyCode);
}

var g_eye=[0,0,-1];
var g_at=[0,0,0];
var g_up=[0,1,0];


var g_map = [
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
  [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
  [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
  [5,0,0,0,0,0,4,2,2,3,3,2,4,4,3,3,3,3,4,2,2,3,2,0,0,0,2,3,2,0,0,5],
  [5,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,3,0,0,5],
  [5,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,3,0,0,5],
  [5,0,0,0,0,0,4,0,0,0,2,3,2,4,3,4,2,3,3,4,3,4,4,0,0,0,3,0,3,0,0,5],
  [5,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,3,0,3,0,0,5],
  [5,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,2,0,2,0,0,5],
  [5,2,4,3,4,3,2,0,0,0,4,4,2,3,2,0,0,0,3,2,4,4,4,0,0,0,2,0,3,0,0,5],
  [5,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,5],
  [5,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,5],
  [5,0,0,4,4,2,3,0,0,0,4,0,2,3,4,3,2,3,2,2,0,0,2,0,0,0,2,0,0,0,0,5],
  [5,0,0,3,0,0,4,0,0,0,2,0,3,0,0,0,0,0,0,2,0,0,3,0,0,0,4,3,3,3,3,5],
  [5,0,0,2,0,0,4,0,0,0,3,0,4,0,0,0,0,0,0,2,0,0,3,0,0,0,0,0,0,0,0,0],
  [5,0,0,4,0,0,1,0,0,0,4,0,4,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0],
  [5,0,0,0,0,0,3,0,0,0,3,0,2,0,0,0,0,0,0,4,0,0,3,0,0,0,0,0,0,0,0,0],
  [5,0,0,0,0,0,3,0,0,0,2,0,2,3,3,3,3,3,3,3,0,0,4,0,0,0,0,4,0,0,0,5],
  [5,0,0,0,0,0,3,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,4,0,0,0,5],
  [5,0,0,4,4,2,4,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,3,0,0,0,5],
  [5,0,0,0,0,0,0,0,0,0,3,3,2,4,4,3,3,2,2,4,3,4,4,0,0,0,0,3,0,0,0,5],
  [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,3,0,0,0,5],
  [5,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,3,0,0,0,5],
  [5,0,0,0,4,4,3,2,2,4,3,2,3,0,0,0,0,3,0,0,0,0,0,0,0,0,0,3,0,0,0,5],
  [5,0,0,0,3,0,0,0,0,0,0,0,2,0,0,0,0,3,0,0,0,0,0,0,0,0,0,3,0,0,0,5],
  [5,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0,5],
  [5,0,0,0,3,3,2,4,4,3,2,4,2,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
  [5,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,4,0,0,0,0,0,0,0,0,0,3,0,0,0,5],
  [5,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,4,0,0,0,0,0,0,0,0,0,3,0,0,0,5],
  [5,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,4,0,0,0,0,0,0,0,0,0,3,0,0,0,5],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
];


// function drawMap() {
//     for (var x=0; x < g_map.length; x++) {
//       for (var y=0; y < g_map.length; y++) {
//         var height = g_map[x][y];
//         for (var z=0; z < height; z++) {
//           var body = new Cube();
//           body.color = [1.0, 1.0, 1.0, 1.0];
//           body.textureNum = 3;
//           body.matrix.translate(x-(g_map.length/2), z-0.75, y-(g_map[x].length/2));
//           body.matrix.scale(1, 1, 1);
//           body.renderfast();
//       }
//     }
//   }
// }

function drawMap() {
  for (var x = 0; x < g_map.length; x++) {
      for (var y = 0; y < g_map[x].length; y++) { // Fixed g_map[x].length
          var height = g_map[x][y];
          for (var z = 0; z < height; z++) {
              var body = new Cube();
              body.color = [1.0, 1.0, 1.0, 1.0];
              if (height <= 3) {
                  body.textureNum = 3;
              } else {
                  body.textureNum = 4;
              }
              body.matrix.translate(x - (g_map.length / 2), z - 0.75, y - (g_map[x].length / 2));
              body.matrix.scale(1, 1, 1);
              body.renderfast();
          }
      }
  }
}


function renderAllShapes() {
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(90, canvas.width / canvas.height, .1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();

  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
  //viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);

  globalRotMat.rotate(g_globalAngleX, 1, 0, 0);
  globalRotMat.rotate(g_globalAngleZ, 0, 0, 1);




  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);


  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);
  //gl.uniform3f(u_cameraPos, g_camera.eye.x, g_camera.eye.y, g_camera.eye.z);

  gl.uniform1i(u_lightOn, g_lightOn);

  var light = new Cube();
  light.color = [2,2,0,1];
  light.textureNum = -2;
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-0.1,-0.1,-0.1);
  light.matrix.translate(-0.5,-0.5,-0.5); 
  light.render();

  var sp = new Sphere();
  if (g_normalOn) {
    sp.textureNum = -3;
  }
  sp.matrix.translate(-2,0.5,-.5);
  sp.render();

  var ground = new Cube();
  ground.color = [1.0, 0.0, 0.0, 1.0];
  ground.textureNum = 1;
  ground.matrix.translate(0, -0.75, 0);
  ground.matrix.scale(10,0,10);
  ground.matrix.translate(-0.5, 0, -0.5);
  ground.render();

  var sky = new Cube();
  sky.color = [1.0, 0.0, 0.0, 1.0];
  // sky.textureNum = -1;
  if (g_normalOn) {
    sky.textureNum = -3;
  }
  sky.matrix.scale(-10,-10,-10);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  //drawMap();

  // Back of Fox Body
  var foxBack = new Cube();
  foxBack.color = [0.6, 0.3, 0.1, 1];
  if (g_normalOn) {
    foxBack.textureNum = -3;
  }
  foxBack.matrix.translate(0, -0.6, 0.0);
  foxBack.matrix.rotate(0, 1, 0, 0);
  foxBack.matrix.rotate(0, 0, 0, 1);
  foxBack.matrix.scale(0.5,0.7,0.2);
  foxBack.matrix.translate(-0.5,0,0);
  //foxBack.normalMatrix.setInverseOf(foxBack.matrix).transpose();
  foxBack.render();

  // Front of Fox Body
  var foxFront = new Cube();
  foxFront.color = [0.95, 0.8, 0.6, 1.0];
  if (g_normalOn) {
    foxFront.textureNum = -3;
  }
  //foxFront.textureNum = 0;
  foxFront.matrix.translate(0, -0.6, -0.20);
  foxFront.matrix.rotate(0, 1, 0, 0);
  foxFront.matrix.rotate(0, 0, 0, 1);
  var attachHead = new Matrix4(foxFront.matrix);
  foxFront.matrix.scale(0.5,0.7,0.2);
  foxFront.matrix.translate(-0.5,0,0);
  foxFront.render();

  // Head of Fox
  var foxHead = new Cube();
  foxHead.color = [0.6,0.3,0.1,1];
  //foxHead.textureNum = 0;
  if (g_normalOn) {
    foxHead.textureNum = -3;
  }
  foxHead.matrix = attachHead;
  foxHead.matrix.translate(0, .70, -0.05);
  foxHead.matrix.rotate(0, 0, 0, 1);
  foxHead.matrix.scale(.5, .40, .5);
  foxHead.matrix.translate(-.5, 0, -0.001)
  foxHead.render();

  // Tail of Fox
  var foxTail = new Cube();
  foxTail.color = [0.4, 0.2, 0.1, 1];
  if (g_normalOn) {
    foxTail.textureNum = -3;
  }
  var tailMatrix = new Matrix4(foxFront.matrix);
  foxTail.matrix = tailMatrix;
  foxTail.matrix.translate(0.4, 0.2, 2.0);
  foxTail.matrix.rotate(g_tailAngle, 0, 1, 0);
  foxTail.matrix.rotate(10, 1, 0, 0);
  foxTail.matrix.scale(.2, .2, 2);
  foxTail.render();

  // Left Arm of Fox
  var foxLeftArm = new Cube();
  foxLeftArm.color = [0.6, 0.3, 0.1, 1];
  if (g_normalOn) {
    foxLeftArm.textureNum = -3;
  }
  var leftArmMatrix = new Matrix4(foxFront.matrix);
  foxLeftArm.matrix = leftArmMatrix;
  foxLeftArm.matrix.translate(0.8, .70, 0.5);
  foxLeftArm.matrix.rotate(g_leftArmAngle, 0, 0, 1);
  foxLeftArm.matrix.rotate(-25, 0, 0, 1);
  foxLeftArm.matrix.scale(.59, .23, 1);
  foxLeftArm.render();

  // Left Hand of Fox
  var foxLeftHand = new Cube();
  foxLeftHand.color = [0.4, 0.2, 0.1, 1];
  if (g_normalOn) {
    foxLeftHand.textureNum = -3;
  }
  foxLeftHand.matrix = leftArmMatrix; 
  foxLeftHand.matrix.translate(1.0, -0.1, 0.01);
  foxLeftHand.matrix.scale(.5, 1.2, .97);
  foxLeftHand.matrix.rotate(g_leftHandAngle,0,1,0);
  foxLeftHand.render();

  // Right Arm of Fox
  var foxRightArm = new Cube();
  foxRightArm.color = [0.6, 0.3, 0.1, 1];
  if (g_normalOn) {
    foxRightArm.textureNum = -3;
  }
  var rightArmMatrix = new Matrix4(foxFront.matrix);
  foxRightArm.matrix = rightArmMatrix;
  foxRightArm.matrix.translate(-0.1, .7, 0.7);
  foxRightArm.matrix.rotate(g_rightArmAngle, 0, 0, 1);
  foxRightArm.matrix.rotate(-25, 0, 0, -1);
  foxRightArm.matrix.scale(.23, .59, 1);
  foxRightArm.render();

  // Right Hand of Fox
  var foxRightHand = new Cube();
  foxRightHand.color = [0.4, 0.2, 0.1, 1];
  if (g_normalOn) {
    foxRightHand.textureNum = -3;
  }
  foxRightHand.matrix = rightArmMatrix; 
  foxRightHand.matrix.translate(-0.1, 1, 0.01);
  foxRightHand.matrix.scale(1.2, 0.4, .97);
  foxRightHand.matrix.rotate(g_rightHandAngle,0,1,0);
  //foxRightHand.matrix.rotate(0,0,1,0);
  foxRightHand.render();

  // Left Leg of Fox
  var foxLeftLeg = new Cube();
  foxLeftLeg.color = [0.4, 0.2, 0.1, 1];
  if (g_normalOn) {
    foxLeftLeg.textureNum = -3;
  }
  foxLeftLeg.matrix.translate(0, -.6, -0.10)
  foxLeftLeg.matrix.rotate(0, 0, 0, 1);
  foxLeftLeg.matrix.scale(0.2, 0.11, .2);
  foxLeftLeg.matrix.translate(-1.30, -1.1, -0.9);
  foxLeftLeg.render();

  // Right Leg of Fox
  var foxRightLeg = new Cube();
  foxRightLeg.color = [0.4, 0.2, 0.1, 1];
  if (g_normalOn) {
    foxRightLeg.textureNum = -3;
  }
  foxRightLeg.matrix.translate(0.07, -.61, -0.29)
  foxLeftLeg.matrix.rotate(0, 0, 0, 1);
  foxRightLeg.matrix.scale(0.2, 0.11, .2);
  foxRightLeg.matrix.translate(0,-1,0);
  foxRightLeg.render();

  // Left Ear of Fox
  var foxLeftEar = new Cone();
  foxLeftEar.color = [0.4, 0.2, 0.1, 1];
  if (g_normalOn) {
    foxLeftEar.textureNum = -3;
  }
  foxLeftEar.matrix = attachHead;
  foxLeftEar.matrix.translate(-0.3, .50, 0);
  foxLeftEar.matrix.rotate(g_leftEarAngle,2,0,0);
  foxLeftEar.matrix.rotate(270, 1, 0, 0);
  
  foxLeftEar.matrix.scale(.15, .15, .8);
  foxLeftEar.matrix.translate(3.4, -4, 0.34);
  foxLeftEar.render();

  // Right Ear of Fox
  var foxRightEar = new Cone();
  foxRightEar.color = [0.4, 0.2, 0.1, 1];
  if (g_normalOn) {
    foxRightEar.textureNum = -3;
  }
  foxRightEar.matrix = attachHead;
  foxRightEar.matrix.translate(0.8, 8, -0.2);
  foxRightEar.matrix.rotate(1, 1, 0, 0);
  foxRightEar.matrix.scale(1, 2, 1);
  foxRightEar.matrix.translate(3.4, -4, 0.34);
  foxRightEar.render();
  

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "theFPS");
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}