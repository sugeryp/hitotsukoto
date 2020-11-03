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
    await page.goto("https://www.amazon.co.jp//", {waitUntil: "domcontentloaded"});

    // input searched words
    await page.type("#twotabsearchtextbox", keyword);

    // click a surch-button
    await page.click(".nav-search-submit.nav-sprite .nav-input");
    await page.waitForNavigation();

    // get result of surching
    const sites = async () => {
        return page.$$eval(".a-section.a-spacing-medium", anchors => {
            return anchors.map(item => {
                if(!Boolean(item.querySelector("h2 span"))) return {};
                if(!Boolean(item.querySelector(".a-link-normal.a-text-normal"))) return {};
                if(!Boolean(item.querySelector(".a-price-whole"))) return {};
                return {
                    title: item.querySelector("h2 span").textContent.trim(),
                    url: item.querySelector(".a-link-normal.a-text-normal").href,
                    price: item.querySelector(".a-price-whole").textContent.trim()
                };
            });
        });
    }
    console.log(await sites())

    for (i = 1; i <= 10; i++) { 
        await page.click(".a-last");
        await page.waitForSelector(".a-last");
        console.log(await sites());
    }

    await browser.close();
}

getURL();