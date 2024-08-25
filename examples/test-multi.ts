/*
  This is an example of 2D rendering, using
  multiple texture pages. The glyphs are batched
  into a single BufferGeometry, and an attribute
  is used to provide the page ID to each glyph.

  The max number of pages is device dependent, based
  on how many samplers can be active at once. Typically
  for WebGL / mobile, this number is at least 8.

  var geom = createText({
    multipage: true,
    ... other options
  })
 */

import * as THREE from 'three';
import Promise from 'bluebird';
import loadBmfont from 'load-bmfont';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import createText from '../lib';
import Shader from '../shaders/multipage';

var loadFont = Promise.promisify(loadBmfont)

// parallel load our font / textures
Promise.all([
  loadFont('fnt/Norwester-Multi-64.fnt'),
  loadTexture('fnt/Norwester-Multi_0.png'),
  loadTexture('fnt/Norwester-Multi_1.png'),
  loadTexture('fnt/Norwester-Multi_2.png'),
  loadTexture('fnt/Norwester-Multi_3.png')
]).then(function (assets) {
  start(assets[0], assets.slice(1))
})

function start(font, textures) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 100);

  const scene = new THREE.Scene();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  var geom = createText({
    multipage: true, // enable page buffers !
    font: font,
    width: 700,
    align: 'left'
  })

  // setup text
  geom.update([
    'This is a multi-page bitmap',
    'font batched into a single',
    'ThreeJS BufferGeometry'
  ].join(' '))

  var material = new THREE.RawShaderMaterial(Shader({
    textures: textures,
    transparent: true,
    opacity: 0.95,
    color: 'rgb(230, 230, 230)'
  }))

  var layout = geom.layout
  var text = new THREE.Mesh(geom, material)
  var padding = 40
  text.position.set(padding, -layout.descender + layout.height + padding, 0)

  var textAnchor = new THREE.Object3D()
  textAnchor.add(text);
  textAnchor.rotateX(Math.PI);
  textAnchor.scale.set(0.1, 0.1, 0.1);
  textAnchor.position.set(0, 0, 0);
  scene.add(textAnchor)

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;

  const animate = () => {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
  }

  animate();
}

function loadTexture(path) {
  return new Promise(function (resolve, reject) {
    THREE.ImageUtils.loadTexture(path, undefined, resolve, reject)
  })
}
