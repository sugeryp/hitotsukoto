const puppeteer = require("puppeteer");

const test = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.type(selector, inputstring, [option]);
    await page.type("input[name=user]", "hello", {delay: 100});
    await page.click(selector, [option]);
    await page.click("input[type=submit]");
    await page.waitForNavigation();
    let content = await page.content();
    await page.pdf({path: "output.pdf", format:"A4"});

    await page.evaluate((title) => {
        document.title = title;
    }, "タイトル");
    let url = await page.$eval("a", (a) => {
        return a.href;
    });
    let urls = await page.$$eval("a", (elements) => {
        return elements.map(a => {
            return a.href;
        });
    });

    await browser.close();
}

test();