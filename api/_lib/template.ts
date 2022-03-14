import {readFileSync} from 'fs';
import {sanitizeHtml} from './sanitizer';
import {ParsedRequest} from './types';

const thin = readFileSync(`${__dirname}/../_fonts/Pretendard-Thin.woff2`).toString('base64');
const extraLight = readFileSync(`${__dirname}/../_fonts/Pretendard-ExtraLight.woff2`).toString('base64');
const light = readFileSync(`${__dirname}/../_fonts/Pretendard-Light.woff2`).toString('base64');
const regular = readFileSync(`${__dirname}/../_fonts/Pretendard-Regular.woff2`).toString('base64');
const medium = readFileSync(`${__dirname}/../_fonts/Pretendard-Medium.woff2`).toString('base64');
const semiBold = readFileSync(`${__dirname}/../_fonts/Pretendard-SemiBold.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Pretendard-Bold.woff2`).toString('base64');
const extraBold = readFileSync(`${__dirname}/../_fonts/Pretendard-ExtraBold.woff2`).toString('base64');
const black = readFileSync(`${__dirname}/../_fonts/Pretendard-Black.woff2`).toString('base64');

// @ts-ignore
function getCss(style: ButtonStyle, fontSize: number, fontWeight: number, height: number) {
    let background = 'rgb(55, 62, 71)'
    let color = 'rgb(173, 186, 199)'

    if (style == 'primary') {
        background = 'rgb(52, 125, 57)'
        color = 'white'
    }
    return `
    @font-face {
    	font-family: 'Pretendard';
    	font-weight: 900;
    	src: url(data:font/woff2;charset=utf-8;base64,${black}) format('woff2');
    }
    
    @font-face {
    	font-family: 'Pretendard';
    	font-weight: 800;
    	src: url(data:font/woff2;charset=utf-8;base64,${extraBold}) format('woff2');
    }
    
    @font-face {
    	font-family: 'Pretendard';
    	font-weight: 700;
    	src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }
    
    @font-face {
    	font-family: 'Pretendard';
    	font-weight: 600;
    	src: url(data:font/woff2;charset=utf-8;base64,${semiBold}) format('woff2');
    }
    
    @font-face {
    	font-family: 'Pretendard';
    	font-weight: 500;
    	src: url(data:font/woff2;charset=utf-8;base64,${medium}) format('woff2');
    }
    
    @font-face {
    	font-family: 'Pretendard';
    	font-weight: 400;
    	src: url(data:font/woff2;charset=utf-8;base64,${regular}) format('woff2');
    }
    
    @font-face {
    	font-family: 'Pretendard';
    	font-weight: 300;
    	src: url(data:font/woff2;charset=utf-8;base64,${light}) format('woff2');
    }
    
    @font-face {
    	font-family: 'Pretendard';
    	font-weight: 200;
    	src: url(data:font/woff2;charset=utf-8;base64,${extraLight}) format('woff2');
    }
    
    @font-face {
    	font-family: 'Pretendard';
    	font-weight: 100;
    	src: url(data:font/woff2;charset=utf-8;base64,${thin}) format('woff2');
    }

    html,
    body {
        font-family: 'Pretendard', sans-serif;
        margin: 0;
        background: transparent;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
    }

    .btn {
        height: ${height - 12}px;
        font-size: ${fontSize}px;
        font-weight: ${fontWeight};
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
    const {text, style, fontSize, fontWeight, height} = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(style, fontSize, fontWeight, height)}
    </style>
    <body>
            <div class="btn">${sanitizeHtml(text)}</div>
    </body>
</html>`;
}
