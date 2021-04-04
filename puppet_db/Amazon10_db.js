const puppeteer = require("puppeteer");
const MongoClient = require('mongodb').MongoClient;

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';

// MongoDB insert
const insertMany = function(document){

    //connect to MongoDB
    MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, client) {

        //destination of DB
        const db = client.db('puppet_test');

        //execute insertOne
        await db.collection('Amazon2').insertMany(
            document
        );

        //close MongoDB
        client.close();
        if(!err) console.log("inert and exit");

	});
};

// get keyword from the argument of the command
let keyword = process.argv[2];
if (!keyword) {
    console.error("引数にキーワードを指定してください。");
    process.exit();
}

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
 
    insertMany(trimURLInSaleObjInSales(await sites()));

    for (i = 1; i <= 10; i++) { 
        await page.click(".a-last");
        await page.waitForSelector(".a-last");
        insertMany(trimURLInSaleObjInSales(await sites()));
    }

    await browser.close();
}

getURL();