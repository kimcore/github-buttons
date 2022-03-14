import {sanitizeHtml} from './sanitizer';
import {ParsedRequest} from './types';

const twemoji = require('twemoji');
const twOptions = {folder: 'svg', ext: '.svg'};
const emojify = (text: string) => twemoji.parse(text, twOptions);

// @ts-ignore
function getCss(style: ButtonStyle, fontSize: number, height: number) {
    let background = 'rgb(55, 62, 71)'
    let color = 'rgb(173, 186, 199)'

    if (style == 'primary') {
        background = 'rgb(52, 125, 57)'
        color = 'white'
    }
    return `
    html,
    body {
        margin: 0;
        background: transparent;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
    }

    .btn {
        height: ${height - 2}px;
        font-size: ${fontSize}px;
        font-weight: 500;
        vertical-align: middle;
        line-height: ${height - 2}px;
        text-align: center;
        color: ${color};
        padding: 5px 16px;
        background-color: ${background};
        border: solid 1px rgba(205, 217, 229, 0.1);
        border-radius: 6px;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const {text, style, fontSize, height} = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(style, fontSize, height)}
    </style>
    <body>
            <div class="btn">${emojify(sanitizeHtml(text))}</div>
    </body>
</html>`;
}
