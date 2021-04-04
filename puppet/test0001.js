const puppeteer = require("puppeteer");

const test = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({width:1200, height:800});
    await page.goto("https://www.yahoo.co.jp/");
    await page.screenshot({path: "yahoo.png", fullPage: true});

    await browser.close();
}

test();