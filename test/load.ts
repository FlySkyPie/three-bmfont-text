import loadFont from 'load-bmfont';
import * as THREE from 'three';

// A utility to load a font, then a texture
export default function (opt, cb) {
  loadFont(opt.font, function (err, font) {
    if (err) throw err
    THREE.ImageUtils.loadTexture(opt.image, undefined, function (tex) {
      cb(font, tex)
    })
  })
};
