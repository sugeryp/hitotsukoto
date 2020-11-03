const MongoClient = require('mongodb').MongoClient;

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';

// main
const createCollectionSortedbyPrice = async (salesCollectionName, itemID) => {

    const client = await MongoClient.connect(url, 
        { useUnifiedTopology: true }
    );

    const db = client.db('puppet_test');

    const salesCollection = db.collection(salesCollectionName);

    const cheapSalesCollectionName = `cheap_sales_${salesCollectionName}_itemID_${itemID}`;

    //aggregate query to make collection sales items are sorted by price low to high, and make new collection
    const querySortByPrice = [
        {$match: {itemID:{$all:[Number(itemID)]}}},
        {$sort: {price: 1}},
        {$out: cheapSalesCollectionName}
    ];

    await salesCollection.aggregate(querySortByPrice).forEach();
 
    //aggregate query to extract keep id which recentory date document has, from cheapsalescollection
    const queryExtractKeepId = [
        {$group: {
            _id: "$url", 
            date: {$max: "$date"}, 
            keep:{$push:{id: "$_id"}}
        }}, 
        {$unwind : "$keep" }
    ];

    const deleteManyExcKeepId = async (collectionName, aggregateQuery) => {
        const collection = db.collection(collectionName);
        await collection.aggregate(aggregateQuery).toArray().then(docs => {
            const keepIds = [];
            for (doc of docs) {
                if ("keep" in doc) {
                    if ("id" in doc.keep) {
                        //console.log(doc);
                        keepIds.push(doc.keep.id);
                    }
                }
            }
            return keepIds;
        }).then(async keepIds => {
            await collection.deleteMany({
                _id: {$nin: keepIds}
            });
        })
    }

    await deleteManyExcKeepId(cheapSalesCollectionName, queryExtractKeepId);

    client.close();
    return cheapSalesCollectionName;
}


// for test 
let salesCollection = process.argv[2];
let itemID = process.argv[3];
createCollectionSortedbyPrice(salesCollection, itemID).then(result => {
    console.log(result);
});