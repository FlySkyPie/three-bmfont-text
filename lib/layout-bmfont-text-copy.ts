
export interface IGlyphs {
    position: [any, any],
    data: any,

    index: any,

    line: any,
}

export interface TextLayout {
    glyphs: IGlyphs[]

    update(opt: any): void;

    getGlyph(font: any, id: any): null | any;

    computeMetrics(text: any, start: any, end: any, width: any): void;
}
