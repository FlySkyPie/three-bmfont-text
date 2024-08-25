import loadFont, { type IResult } from 'load-bmfont';
import * as THREE from 'three';

/**
 * A utility to load a font, then a texture
 * @deprecated
 */
export default function (opt: any, cb: any) {
  loadFont(opt.font, function (err, font) {
    if (err) throw err;
    // console.log(font);
    THREE.ImageUtils.loadTexture(opt.image, undefined, function (tex) {
      cb(font, tex)
    })
  })
};

export const loadFontPromise = (fontPath: string) => new Promise<IResult>((resove, reject) => {
  loadFont(fontPath, (err, font) => {
    if (err) {
      reject(err);
      return;
    }
    resove(font);
  })
});

export const loadTexturePromise = (texturePath: string) => new Promise<THREE.Texture>((resove) => {
  THREE.ImageUtils.loadTexture(texturePath, undefined, function (tex) {
    resove(tex)
  })
});
