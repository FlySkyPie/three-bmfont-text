import assign from 'object-assign';
import * as THREE from 'three';

export default function createMSDFShader(opt) {
  opt = opt || {};
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001;
  var precision = opt.precision || 'highp';
  var color = opt.color;
  var map = opt.map;
  var negate = typeof opt.negate === 'boolean' ? opt.negate : true;

  // remove to satisfy r73
  delete opt.map;
  delete opt.color;
  delete opt.precision;
  delete opt.opacity;
  delete opt.negate;

  return assign({
    uniforms: {
      opacity: { type: 'f', value: opacity },
      map: { type: 't', value: map || new THREE.Texture() },
      color: { type: 'c', value: new THREE.Color(color) }
    },
    vertexShader: [
      '#version 300 es',
      'in vec2 uv;',
      'in vec4 position;',
      'uniform mat4 projectionMatrix;',
      'uniform mat4 modelViewMatrix;',
      'out vec2 vUv;',
      'void main() {',
      'vUv = uv;',
      'gl_Position = projectionMatrix * modelViewMatrix * position;',
      '}'
    ].join('\n'),
    fragmentShader: [
      '#version 300 es',
      '#ifdef GL_OES_standard_derivatives',
      '#extension GL_OES_standard_derivatives : enable',
      '#endif',
      'precision ' + precision + ' float;',
      'uniform float opacity;',
      'uniform vec3 color;',
      'uniform sampler2D map;',
      'out vec2 vUv;',

      'float median(float r, float g, float b) {',
      '  return max(min(r, g), min(max(r, g), b));',
      '}',

      'void main() {',
      '  vec3 sampleR = ' + (negate ? '1.0 - ' : '') + 'texture(map, vUv).rgb;',
      '  float sigDist = median(sampleR.r, sampleR.g, sampleR.b) - 0.5;',
      '  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);',
      '  vec4 fragColor = vec4(color.xyz, alpha * opacity);',
      alphaTest === 0
        ? ''
        : '  if (fragColor.a < ' + alphaTest + ') discard;',
      '}'
    ].join('\n')
  }, opt);
};
