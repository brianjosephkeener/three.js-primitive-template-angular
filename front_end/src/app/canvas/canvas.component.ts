import { Component } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as dat from 'dat.gui';
// import gsap from 'gsap'

@Component({
  selector: 'app-3dcanvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent {

}


/*

Groups, Camera.lookat(), THREE.Clock(),

Dat.GUI for debugging, Physically based rendering (textures)

https://threejs.org/

*/

// Canvas
const canvasElement = document.getElementsByTagName("canvas")[0];

// Scene
const scene = new THREE.Scene();

// Camera - Perspective
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

// Renderer 
var renderer = new THREE.WebGLRenderer({
  canvas: canvasElement
});
document.body.appendChild( renderer.domElement );

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize( window.innerWidth, window.innerHeight );

// Controls

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Textures

/* 

Method 1

const image = new Image();
const texture = new THREE.Texture(image)
image.src = 'assets/textures/Aircraft_inclusion.png' 
image.addEventListener('load', () => {
  texture.needsUpdate = true;
})

*/

// Method 2 (easy)

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('assets/textures/Aircraft_inclusion.png')

// Resize Window Event Handler 

window.addEventListener('resize', () => {
  // update renderer
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
})

// Fullscreen / Dbclick Event Handler

window.addEventListener('dblclick', () => {
  if(!document.fullscreenElement)
  {
    canvasElement.requestFullscreen()
  }
  else 
  {
    document.exitFullscreen()
  }
});


// Axes Helper 
// const axesHelper = new THREE.AxesHelper(2);
//scene.add(axesHelper);
//axesHelper.position.x = 2;

// objects
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { 
  map: texture,
  wireframe: false } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 10;

// Lights

/* 

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

*/ 

// animation

const clock = new THREE.Clock();

const tick = () =>
{
  const elaspedTime = clock.getElapsedTime();
  window.requestAnimationFrame(tick);
  // render scene
  renderer.render( scene, camera );

  controls.update();

  cube.rotation.x += .01;
  cube.rotation.y += .01;

}

tick();


// Debug
const gui = new dat.GUI();
gui.add(cube.position, 'y', -3, 3, .01).name('y-axis');
gui.add(cube.position, 'x').max(3).min(-3).step(0.01).name('horizontal');
gui.add(cube.position, 'z', -3, 3, .01);

gui.add(cube, 'visible');
gui.add(material, 'wireframe');