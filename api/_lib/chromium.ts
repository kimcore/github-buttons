import core from 'puppeteer-core';
import {getOptions} from './options';
import {FileType, ParsedRequest} from './types';

let _page: core.Page | null;

async function getPage(isDev: boolean) {
    if (_page) {
        return _page;
    }
    const options = await getOptions(isDev);
    const browser = await core.launch(options);
    _page = await browser.newPage();
    return _page;
}

export async function getScreenshot(html: string, type: FileType, isDev: boolean, parsedReq: ParsedRequest) {
    const {width, height} = parsedReq;
    const page = await getPage(isDev);
    await page.setViewport({width: width + 10, height: height + 10});
    await page.setContent(html);
    return page.screenshot({type, omitBackground: true});
}
