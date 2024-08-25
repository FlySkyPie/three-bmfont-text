declare module 'layout-bmfont-text' {
    export interface TextLayout {
        update(opt: any): void;

        getGlyph(font: any, id: any): null | any;

        computeMetrics(text: any, start: any, end: any, width: any): void;
    }

    function createLayout(opt: any): TextLayout;

    export default createLayout;
};
