/*
  This is an example of 2D rendering, simply
  using bitmap fonts in orthographic space.

  var geom = createText({
    multipage: true,
    ... other options
  })
 */

import * as THREE from 'three';

import load from './load';

import createText from '../lib';

load({
  font: 'fnt/Lato-Regular-64.fnt',
  image: 'fnt/lato.png'
}, start)

function start(font, texture) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', () => {
    app.camera.right = window.innerWidth;
    app.camera.bottom = window.innerHeight;
    app.camera.updateProjectionMatrix();
  });

  const app = {
    camera: new THREE.OrthographicCamera(0, 100, 0, 100, -100, 100),
    scene: new THREE.Scene(),
  };
  // var app = createOrbitViewer({
  //   clearColor: 'rgb(80, 80, 80)',
  //   clearAlpha: 1.0,
  //   fov: 65,
  //   position: new THREE.Vector3()
  // })



  var geom = createText({
    text: 'this bitmap text\nis rendered with \nan OrthographicCamera',
    font: font,
    align: 'left',
    width: 700,
    flipY: texture.flipY
  })

  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    color: 'rgb(230, 230, 230)'
  })

  var layout = geom.layout
  var text = new THREE.Mesh(geom, material)
  var padding = 40
  text.position.set(padding, -layout.descender + layout.height + padding, 0)

  var textAnchor = new THREE.Object3D()
  textAnchor.add(text)
  textAnchor.scale.multiplyScalar(1 / (window.devicePixelRatio || 1))
  app.scene.add(textAnchor)

  // update orthographic
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(app.scene, app.camera);
  }

  animate();

}
