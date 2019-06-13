import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import model from '../asset/Building_Geometry_NoRoof.babylon';
import { currentEnv } from './environment';

const FLOOR_DIMENSIONS_X = 34;
const FLOOR_DIMENSIONS_Z = 7.25 + 35;
const SPHERE_DIAMETER = 0.7;

class Screen3D {
  engine: BABYLON.Engine;
  labelTexture: GUI.AdvancedDynamicTexture;
  scene: BABYLON.Scene;

  constructor(canvas: HTMLCanvasElement) {
    this.engine =
      currentEnv(DEFINE_NODE_ENV).NODE_ENV === 'test'
        ? new BABYLON.NullEngine()
        : new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
          });

    this.scene = this.drawScreen3d(canvas);
    this.labelTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      'UI',
      true,
      this.scene
    );
  }

  createSphere(diameter: number): BABYLON.Mesh {
    // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    const sphere = BABYLON.Mesh.CreateSphere(
      'sphere1',
      16,
      diameter,
      this.scene,
      false,
      BABYLON.Mesh.FRONTSIDE
    );

    // Move the sphere upward 1/2 of its height
    sphere.position.y = diameter / 2;

    return sphere;
  }

  addBeacon(name: string): BABYLON.Mesh {
    // Create a built-in "sphere" shape - it represents a beacon
    const beacon = this.createSphere(SPHERE_DIAMETER);

    // Add a label above the sphere
    this.createLabel(beacon, name);

    return beacon;
  }

  setPosition(beacon: BABYLON.Mesh, x: number, y: number): void {
    // Each floor is in the XZ plane
    // The Y axis points up/down between floors
    beacon.position.x = x;
    beacon.position.z = -y;
  }

  onResize = () => {
    this.engine.resize();
  };

  drawScreen3d(canvas: HTMLCanvasElement): BABYLON.Scene {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // call the createScene function
    const scene = this.createScene(canvas);

    // run the render loop
    this.engine.runRenderLoop(() => {
      scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', this.onResize);

    return scene;
  }

  createScene(canvas: HTMLCanvasElement): BABYLON.Scene {
    // Create a basic BJS Scene object
    const scene = new BABYLON.Scene(this.engine);

    // Create an ArcRotateCamera
    const camera = new BABYLON.ArcRotateCamera(
      'Camera',
      (3 * Math.PI) / 4,
      Math.PI / 4,
      70,
      new BABYLON.Vector3(FLOOR_DIMENSIONS_X / 2, 0, -FLOOR_DIMENSIONS_Z / 2),
      scene
    );

    // Make the camera zoom slower
    camera.wheelPrecision *= 3;

    // Change to ortographic projection
    // camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

    // Attach the camera to the canvas
    camera.attachControl(canvas, false);

    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    const light = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(0, 1, 0),
      scene
    );

    // Load the 3D model
    BABYLON.SceneLoader.Append('', model, scene, loadedScene => {
      // do something with the scene
      console.log('Model loaded...', loadedScene);
    });

    // Return the created scene
    return scene;
  }

  createLabel(sphere: BABYLON.Mesh, text: string): void {
    // Create a text block which shows the name of the beacon
    const label = new GUI.TextBlock();
    label.text = text;
    this.labelTexture.addControl(label);

    // Move the label so that it tracks the position of the sphere mesh
    label.linkWithMesh(sphere);
    label.linkOffsetY = -25;
  }

  /**
   * Delete all resources and listeners for this Babylonjs session. This must be
   * called e.g. for every component unmount.
   */
  dispose(): void {
    this.engine.dispose();
    window.removeEventListener('resize', this.onResize);
  }
}

export default Screen3D;
