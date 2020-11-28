const puppeteer = require("puppeteer");
const MongoClient = require('mongodb').MongoClient;

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';

// MongoDB insert
const insertMany = (url, dbName, collectionName, doc) => {

    //connect to MongoDB
    MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, client) {

        //destination of DB
        const db = client.db(dbName);

        //execute insertOne
        await db.collection(collectionName).insertMany(
            doc
        );

        //close MongoDB
        client.close();
        if(!err) console.log("inert and exit");

	});
};

const trimURLInSaleObjInSales = (sales) => {
    const trimAmazonURL = (url) => {
        reg1 = /(?<=www.amazon.co.jp).*(?=\/dp\/)/;
        reg2 = /(?<=\/ref=sr).*/;
        reg3 = /\/ref=sr/;
        return url.replace(reg1, "").replace(reg2, "").replace(reg3, "/");
    }

    const detectSponsSaleObj = (sale) => {
        return sale.match(/\/gp\//);
    } 

    return sales.map(sale => {
        if (sale) {
            let url = sale.url;
            if (typeof sale.url == "string") {
                url = trimAmazonURL(sale.url);
            }
            return {
                title: sale.title,
                url: url,
                price: sale.price,
                date: sale.date
            }
        }
    }).filter(sale => {
        if (sale) {
            if (typeof sale.url == "string") {
                return !detectSponsSaleObj(sale.url);
            }   
        }
    });
}

const searchItems = async (url, dbName, collectionName, keyword) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    // read page searched on
    await page.goto("https://www.amazon.co.jp//", {waitUntil: "domcontentloaded"});

    // input searched words
    await page.type("#twotabsearchtextbox", keyword);

    // click a surch-button
    await page.click(".nav-search-submit.nav-sprite .nav-input");
    await page.waitForNavigation();

    // get result of search
    const sites = async () => {
        return page.$$eval(".a-section.a-spacing-medium", anchors => {
            return anchors.map(item => {
                if(!Boolean(item.querySelector("h2 span"))) return {};
                if(!Boolean(item.querySelector(".a-link-normal.a-text-normal"))) return {};
                if(!Boolean(item.querySelector(".a-price-whole"))) return {};
                return {
                    title: item.querySelector("h2 span").textContent.trim(),
                    url: item.querySelector(".a-link-normal.a-text-normal").href,
                    price: item.querySelector(".a-price-whole").textContent.trim(),
                    date: Date.now()
                };
            });
        });
    }
 
    insertMany(url, dbName, collectionName, trimURLInSaleObjInSales(await sites()));

    for (i = 1; i <= 10; i++) { 
        await page.click(".a-last");
        await page.waitForSelector(".a-last");
        insertMany(url, dbName, collectionName, trimURLInSaleObjInSales(await sites()));
    }

    await browser.close();
}

export {searchItems as serchAmazonItems};