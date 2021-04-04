const puppeteer = require("puppeteer");

// get keyword from the argument of the command
let keyword = process.argv[2];
if (!keyword) {
    console.error("引数にキーワードを指定してください。");
    process.exit();
}

const getURL = async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    // read page searched on
    await page.goto("https://www.google.com/", {waitUntil: "domcontentloaded"});

    // input searched words
    await page.type("input[name=q]", keyword);

    // click a surch-button
    await page.click("div.FPdoLc input[name=btnK]");
    await page.waitForNavigation();

    // get result of surching
    let sites = await page.$$eval(".r a:not([class])", anchors => {
        return anchors.map(a => {
            return {
                title: a.querySelector("h3").textContent.trim(),
                url: a.href
            };
        });
    });
    console.log(sites)

    await browser.close();
}

getURL();