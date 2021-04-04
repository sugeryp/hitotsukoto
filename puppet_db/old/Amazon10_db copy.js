const puppeteer = require("puppeteer");
const MongoClient = require('mongodb').MongoClient;

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';

// MongoDB insert
const insertMany = function(document){

    //connect to MongoDB
    MongoClient.connect(url, function(err, client) {

        //destination of DB
        const db = client.db('puppet_test');

        //execute insertOne
        db.collection('test2').insertMany(
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
    insertMany(await sites());

    for (i = 1; i <= 10; i++) { 
        await page.click(".a-last");
        await page.waitForSelector(".a-last");
        insertMany(await sites());
    }

    await browser.close();
}

getURL();

const findAll = function(){

    //connect to MongoDB
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {

        //destination of DB
        const db = client.db('puppet_test');

        //execute insertOne
        db.collection('test2').find().each(function(err, docs) {
            console.log('find start')
            console.log(docs);
    })

        //close MongoDB
        client.close();
        if(!err) console.log("find and exit");

	});
};

findAll();