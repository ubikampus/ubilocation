import * as BABYLON from 'babylonjs';
import backgroundMap from '../asset/kirjasto_2krs.png';

const MAP_WIDTH = 2083;
const MAP_HEIGHT = 1562;

export const addBeacon = (scene: BABYLON.Scene): BABYLON.Mesh => {
  // Create a built-in "sphere" shape - it represents a beacon
  return createSphere(scene);
};

export const setPosition = (
  beacon: BABYLON.Mesh,
  x: number,
  y: number
): void => {
  // We are in a XZ-coordinate system
  // The origin is at the center
  // The X-axis points to the right
  // The Z-axis points up
  beacon.position.x = (x - MAP_WIDTH / 4) / 100;
  beacon.position.z = (y - MAP_HEIGHT / 4) / 100;
};

export const drawScreen3d = (): BABYLON.Scene => {
  // Create a canvas DOM element
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  // Load the 3D engine
  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  });

  // call the createScene function
  const scene = createScene(canvas, engine);

  // run the render loop
  engine.runRenderLoop(() => {
    scene.render();
  });

  // the canvas/window resize event handler
  window.addEventListener('resize', () => {
    engine.resize();
  });

  return scene;
};

const createScene = (
  canvas: HTMLCanvasElement,
  engine: BABYLON.Engine
): BABYLON.Scene => {
  // Create a basic BJS Scene object
  const scene = new BABYLON.Scene(engine);

  // Create an ArcRotateCamera
  const camera = new BABYLON.ArcRotateCamera(
    'Camera',
    -Math.PI / 2,
    Math.PI / 4,
    20,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );

  // Change to ortographic projection
  // camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

  // Attach the camera to the canvas
  camera.attachControl(canvas, true);

  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  const light = new BABYLON.HemisphericLight(
    'light1',
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Create a built-in "ground" shape - it represents the background map
  const ground = createBackgroundMap(scene);

  // Return the created scene
  return scene;
};

const createSphere = (scene: BABYLON.Scene): BABYLON.Mesh => {
  // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  const sphere = BABYLON.Mesh.CreateSphere(
    'sphere1',
    16,
    0.5,
    scene,
    false,
    BABYLON.Mesh.FRONTSIDE
  );

  // Move the sphere upward 1/2 of its height
  sphere.position.y = 0.25;

  return sphere;
};

const createBackgroundMap = (scene: BABYLON.Scene): BABYLON.Mesh => {
  // Create a built-in "ground" shape; its constructor takes 6 params: name, width, height, subdivision, scene, updatable
  const ground = BABYLON.Mesh.CreateGround(
    'ground1',
    MAP_WIDTH / 100,
    MAP_HEIGHT / 100,
    2,
    scene,
    false
  );

  // Add a map texture on the "ground" shape
  const mapMaterial = new BABYLON.StandardMaterial('mapMaterial', scene);
  mapMaterial.diffuseTexture = new BABYLON.Texture(backgroundMap, scene);
  ground.material = mapMaterial;

  return ground;
};
