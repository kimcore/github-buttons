import {readFileSync} from 'fs';
import {sanitizeHtml} from './sanitizer';
import {ParsedRequest} from './types';

const pretendard = readFileSync(`${__dirname}/../_fonts/Pretendard-SemiBold.woff2`).toString('base64');

// @ts-ignore
function getCss(style: ButtonStyle, fontSize: number, height: number) {
    let background = 'rgb(55, 62, 71)'
    let color = 'rgb(173, 186, 199)'

    if (style == 'primary') {
        background = 'rgb(52, 125, 57)'
        color = 'white'
    }
    return `
    @font-face {
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 600;
        src: url(data:font/woff2;charset=utf-8;base64,${pretendard}) format('woff2');
    }

    html,
    body {
        font-family: 'Pretendard', sans-serif;
        font-weight: 600;
        margin: 0;
        background: transparent;
    }

    .btn {
        height: ${height - 12}px;
        font-size: ${fontSize}px;
        vertical-align: middle;
        line-height: ${height - 12}px;
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
            <div class="btn">${sanitizeHtml(text)}</div>
    </body>
</html>`;
}
