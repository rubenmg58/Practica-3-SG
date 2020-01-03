
/// Several functions, including the main

/// The scene graph
scene = null;

/// The GUI information
GUIcontrols = null;

/// The object for the statistics
stats = null;


/// A boolean to know if the left button of the mouse is down
mouseDown = false;


/// It creates the GUI and, optionally, adds statistic information
/**
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI (withStats) {
  GUIcontrols = new function() {
    setMessage ("PREPARATE");

  }

  var gui = new dat.GUI();


  if (withStats)
    stats = initStats();
}


/// It adds statistics information to a previously created Div
/**
 * @return The statistics object
 */
function initStats() {

  var stats = new Stats();

  stats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  $("#Stats-output").append( stats.domElement );

  return stats;
}

/// It shows a feed-back message for the user
/**
 * @param str - The message
 */
function setMessage (str) {
  document.getElementById ("Messages").innerHTML = "<h2>"+str+"</h2>";
}


/// It processes the window size changes
function onWindowResize () {
  scene.setCameraAspect (window.innerWidth / window.innerHeight);
  renderer.setSize (window.innerWidth, window.innerHeight);
}

/// It creates and configures the WebGL renderer
/**
 * @return The renderer
 */
function createRenderer () {
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  return renderer;
}

/// It renders every frame
function render() {
  //requestAnimationFrame(render);

    requestAnimationFrame( render );
    stats.update();
    //scene.getCameraControls().update ();
    scene.animate(GUIcontrols);
    //scene.simulate( undefined, 2 );

    renderer.render(scene, scene.getCamera());

}



/// The main function
$(function () {
  // create a render and set the size
  renderer = createRenderer();
  // add the output of the renderer to the html element
  $("#WebGL-output").append(renderer.domElement);
  // listeners
  window.addEventListener ("resize", onWindowResize);

  window.addEventListener('keydown',function(e){
    scene.keystate[e.keyCode || e.which] = true;
  },true);
  
  window.addEventListener('keyup',function(e){
    scene.keystate[e.keyCode || e.which] = false;
  },true);
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new TheScene (renderer.domElement);
  //scene.setFixedTimeStep(1/60); 
  //scene.reportsize = 10;
  //scene.simulate( undefined, 2 );

  createGUI(true);

  render();
});
