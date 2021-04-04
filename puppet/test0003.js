const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors");
const iPhoneX = devices("iPhone X");

const test = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulate(iPhoneX);
    await page.goto("https://www.yahoo.co.jp/");
    await page.screenshot({path: "yahoo.png", fullPage: true});
    await browser.close();
}

test();