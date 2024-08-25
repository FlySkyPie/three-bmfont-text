import * as THREE from 'three';
import createLayout from 'layout-bmfont-text';
import createIndices from 'quad-indices';

import * as vertices from './vertices';
import * as utils from './utils';

export interface ICreateTextGeometryOptions {
  font?: any;

  text?: string;

  multipage?: any;

  flipY?: any;

  align?: any;

  width?: any;
}

export default function createTextGeometry(opt: ICreateTextGeometryOptions) {
  return new TextGeometry(opt)
};

class TextGeometry extends THREE.BufferGeometry {
  public _opt: ICreateTextGeometryOptions;

  public layout: any;

  public visibleGlyphs: any;

  constructor(opt: ICreateTextGeometryOptions | string) {
    super()

    if (typeof opt === 'string') {
      opt = { text: opt }
    }

    // use these as default values for any subsequent
    // calls to update()
    this._opt = Object.assign({}, opt)

    // also do an initial setup...
    if (opt) this.update(opt)
  }

  update(_opt: ICreateTextGeometryOptions | string) {
    if (typeof _opt === 'string') {
      _opt = { text: _opt }
    }

    // use constructor defaults
    _opt = Object.assign({}, this._opt, _opt)

    if (!_opt.font) {
      throw new TypeError('must specify a { font } in options')
    }

    this.layout = createLayout(_opt)

    // get vec2 texcoords
    var flipY = _opt.flipY !== false

    // the desired BMFont data
    var font = _opt.font

    // determine texture size from font file
    var texWidth = font.common.scaleW
    var texHeight = font.common.scaleH

    // get visible glyphs
    var glyphs = this.layout.glyphs.filter(function (glyph: any) {
      var bitmap = glyph.data
      return bitmap.width * bitmap.height > 0
    })

    // provide visible glyphs for convenience
    this.visibleGlyphs = glyphs

    // get common vertex data
    var positions = vertices.positions(glyphs)
    var uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY)
    var indices = createIndices([], {
      clockwise: true,
      type: 'uint16',
      count: glyphs.length
    })

    // update vertex data
    // console.log(this)
    this.setIndex(indices)
    this.setAttribute('position', new THREE.BufferAttribute(positions, 2))
    this.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

    // update multipage data
    if (!_opt.multipage && 'page' in this.attributes) {
      // disable multipage rendering
      this.removeAttribute('page')
    } else if (_opt.multipage) {
      // enable multipage rendering
      var pages = vertices.pages(glyphs)
      this.setAttribute('page', new THREE.BufferAttribute(pages, 1))
    }

    // recompute bounding box and sphere, if present
    if (this.boundingBox !== null) {
      this.computeBoundingBox();
    }
    if (this.boundingSphere !== null) {
      this.computeBoundingSphere();
    }
  }

  computeBoundingSphere() {
    if (this.boundingSphere === null) {
      this.boundingSphere = new THREE.Sphere()
    }

    var positions = this.attributes.position.array
    var itemSize = this.attributes.position.itemSize
    if (!positions || !itemSize || positions.length < 2) {
      this.boundingSphere.radius = 0
      this.boundingSphere.center.set(0, 0, 0)
      return
    }
    utils.computeSphere(positions, this.boundingSphere)
    if (isNaN(this.boundingSphere.radius)) {
      console.error('THREE.BufferGeometry.computeBoundingSphere(): ' +
        'Computed radius is NaN. The ' +
        '"position" attribute is likely to have NaN values.')
    }
  }

  computeBoundingBox() {
    if (this.boundingBox === null) {
      this.boundingBox = new THREE.Box3()
    }

    var bbox = this.boundingBox
    var positions = this.attributes.position.array
    var itemSize = this.attributes.position.itemSize
    if (!positions || !itemSize || positions.length < 2) {
      bbox.makeEmpty()
      return
    }
    utils.computeBox(positions, bbox)
  }

}
