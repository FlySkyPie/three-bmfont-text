import type { IResult } from './load-bmfont-copy';

export interface ICreateTextGeometryOptions {
    /**
     * the BMFont definition which holds chars, kernings, etc
     */
    font: IResult;

    /**
     * the text to layout. Newline characters (`\n`) will cause line breaks
     */
    text: string;

    /**
     * whether to construct this geometry with an extra buffer containing page IDs. 
     * This is necessary for multi-texture fonts
     * @default false
     */
    multipage?: boolean;

    /**
     * whether the texture will be Y-flipped
     * @default true
     */
    flipY?: boolean;

    /**
     * can be "left", "center" or "right"
     * @default "left"
     */
    align?: 'left' | 'center' | 'right';

    /**
     * the desired width of the text box, causes word-wrapping and clipping in "pre" mode. 
     * Leave as undefined to remove word-wrapping (default behaviour)
     */
    width?: number;

    /**
     * a mode for word-wrapper; can be 'pre' (maintain spacing), or 'nowrap' (collapse whitespace 
     * but only break on newline characters), otherwise assumes normal word-wrap behaviour 
     * (collapse whitespace, break at width or newlines)
     */
    mode?: 'pre' | 'nowrap';

    /**
     * the letter spacing in pixels
     * @default 0
     */
    letterSpacing?: number;

    /**
     * he line height in pixels
     * @default `font.common.lineHeight``
     */
    lineHeight?: number;

    /**
     * the number of spaces to use in a single tab
     * @default 4
     */
    tabSize?: number;

    /**
     * the starting index into the text to layout 
     * @default 0
     */
    start?: number;

    /**
     * the ending index (exclusive) into the text to layout
     * @default `text.length`
     */
    end?: number;
};
