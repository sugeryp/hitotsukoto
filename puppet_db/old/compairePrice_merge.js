const MongoClient = require('mongodb').MongoClient;

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';

// compairePrice main
const compairePrice = async (itemCollectionName, salesCollectionName, itemID) => {

    const client = await MongoClient.connect(url, 
        { useUnifiedTopology: true }
    );

    const db = client.db('puppet_test');

    const collection = db.collection(itemCollectionName);

    //aggregate query to look for cheapest sales item
    const queryCheapest = [
        {$match: {itemID: Number(itemID) }}, 
        {$lookup: {from: salesCollectionName, localField: "itemID",foreignField: "itemID",as: "sales"}}, 
        {$unwind: "$sales" }, 
        {$sort: {"sales.price": 1}}, 
        {$sort: {"sales.price": 1}},
    ];
    console.log(queryCheapest);

    // const bulk = collection.initializeUnorderedBulkOp();

    // find UnDigitWord and convert to digit then, update
    const aggregate = await collection.aggregate(queryCheapest).forEach((docs) => {
        if (typeof docs == "object") {
            console.log(docs);
        }
    });
    //await bulk.execute();
    client.close();
    console.log("MongoDB Close");
    return aggregate;
};


// for test 
let itemCollection = process.argv[2];
let salesCollection = process.argv[3];
let itemID = process.argv[4];
compairePrice(itemCollection, salesCollection, itemID).then((result) => {console.log(result)})

/**
compairePrice(itemCollection, salesCollection, itemID).then((result) => {
    result.forEach(
        docs => {
            console.log(docs);
        }
    );
});
*/