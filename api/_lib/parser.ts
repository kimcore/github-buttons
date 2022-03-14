import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname, query } = parse(req.url || '/', true);
    const { style, fontSize, width, height } = (query || {});

    if (Array.isArray(style)) {
        throw new Error('Expected a single style');
    }
    if (fontSize && !Number.isInteger(Number(fontSize))) {
        throw new Error('Expected a valid fontSize');
    }
    if (fontSize && (Number(fontSize) > 100 || Number(fontSize) < 1)) {
        throw new Error('Expected a valid fontSize');
    }
    if (width && !Number.isInteger(Number(width))) {
        throw new Error('Expected a valid width');
    }
    if (width && (Number(width) > 4096 || Number(width) < 1)) {
        throw new Error('Expected a valid width');
    }
    if (height && !Number.isInteger(Number(height))) {
        throw new Error('Expected a valid height');
    }
    if (height && (Number(height) > 4096 || Number(height) < 1)) {
        throw new Error('Expected a valid height');
    }

    const arr = (pathname || '/').slice(1).split('.');
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        extension = arr.pop() as string;
        text = arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
        style: style == 'primary' ? 'primary' : 'secondary',
        fontSize: Number(fontSize) || 14,
        width: Number(width) || 105,
        height: Number(height) || 32
    };
    return parsedRequest;
}
