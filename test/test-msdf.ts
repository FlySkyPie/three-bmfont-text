/*
  This is an example of 2D rendering, simply
  using bitmap fonts in orthographic space.

  var geom = createText({
    multipage: true,
    ... other options
  })
 */

import * as THREE from 'three';
import shuffle from 'array-shuffle';
import data from 'sun-tzu-quotes/quotes.json';
import palettes from 'nice-color-palettes';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import createText from '../lib';
import MSDFShader from '../shaders/msdf';

import load from './load';

var quotes = shuffle(data.join(' ').split('.'))

var palette = palettes[5]
var background = palette.shift()

load({
  font: 'fnt/Roboto-msdf.json',
  image: 'fnt/Roboto-msdf.png'
}, start)

function start(font, texture) {
  const containerElement = document.createElement('div');
  document.body.appendChild(containerElement);

  const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  containerElement.appendChild(renderer.domElement);

  console.log("wtf", renderer.capabilities)

  const app = {
    // camera: new THREE.OrthographicCamera(0, 100, 0, 100, -1, 1000),
    camera: new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000),
    scene: new THREE.Scene(),
  };
  app.camera.position.set(0, -4, -2);

  // var width = window.innerWidth;
  // var height = window.innerHeight;
  // app.camera.left = -width / 2;
  // app.camera.right = width / 2;
  // app.camera.top = -height / 2;
  // app.camera.bottom = height / 2;
  app.scene.background = new THREE.Color(background);

  const axesHelper = new THREE.AxesHelper(5);
  app.scene.add(axesHelper);

  const controls = new OrbitControls(app.camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;

  var container = new THREE.Object3D()
  app.scene.add(container)
  var count = 25
  for (var i = 0; i < count; i++) {
    createGlyph()
  }

  var time = 0
  // update orthographic

  window.addEventListener('resize', () => {
    app.camera.aspect = window.innerWidth / window.innerHeight;
    app.camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  window.addEventListener('resize', () => {
    var width = window.innerWidth;
    var height = window.innerHeight;
    // app.camera.left = -width / 2;
    // app.camera.right = width / 2;
    // app.camera.top = -height / 2;
    // app.camera.bottom = height / 2;
    // app.camera.updateProjectionMatrix();
  });


  const animate = (dt: number) => {
    requestAnimationFrame(animate);

    time += dt / 1000
    var s = (Math.sin(time * 0.5) * 0.5 + 0.5) * 2.0 + 0.5
    container.scale.set(s, s, s);

    controls.update();

    renderer.render(app.scene, app.camera);
  }

  animate(0);

  function createGlyph() {
    var angle = (Math.random() * 2 - 1) * Math.PI
    var geom = createText({
      text: quotes[Math.floor(Math.random() * quotes.length)].split(/\s+/g).slice(0, 6).join(' '),
      font: font,
      align: 'left',
      flipY: texture.flipY
    })

    var material = new THREE.RawShaderMaterial(MSDFShader({
      map: texture,
      transparent: true,
      color: palette[Math.floor(Math.random() * palette.length)],
      // glslVersion: THREE.GLSL3,
    }))

    var layout = geom.layout
    var text = new THREE.Mesh(geom, material)
    text.position.set(0, -layout.descender + layout.height, 0)
    text.scale.multiplyScalar(Math.random() * 0.5 + 0.5)

    var textAnchor = new THREE.Object3D()
    textAnchor.add(text)
    textAnchor.rotation.z = angle
    container.add(textAnchor)
  }
}
