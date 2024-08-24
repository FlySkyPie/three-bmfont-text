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
import orbitViewer from 'three-orbit-viewer';
import Promise from 'bluebird';
import loadBmfont from 'load-bmfont';

import createText from '../lib';
import Shader from '../shaders/multipage';

var createOrbitViewer = orbitViewer(THREE);
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
  var app = createOrbitViewer({
    clearColor: 'rgb(80, 80, 80)',
    clearAlpha: 1.0,
    fov: 65,
    position: new THREE.Vector3()
  })

  app.camera = new (THREE.OrthographicCamera as any)()
  app.camera.left = 0
  app.camera.top = 0
  app.camera.near = -100
  app.camera.far = 100

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
  textAnchor.add(text)
  textAnchor.scale.multiplyScalar(1 / (window.devicePixelRatio || 1))
  app.scene.add(textAnchor)

  // update orthographic
  app.on('tick', function () {
    var width = app.engine.width
    var height = app.engine.height
    app.camera.right = width
    app.camera.bottom = height
    app.camera.updateProjectionMatrix()
  })
}

function loadTexture(path) {
  return new Promise(function (resolve, reject) {
    THREE.ImageUtils.loadTexture(path, undefined, resolve, reject)
  })
}
