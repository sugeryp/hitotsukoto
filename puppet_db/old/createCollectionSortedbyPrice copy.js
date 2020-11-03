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

    const cheapSalesCollectionName = `cheap_sales_itemID_${itemID}`;
    console.log(salesCollectionName);
    console.log(Number(itemID));
    console.log(cheapSalesCollectionName);

    //aggregate query to make collection sales items are sorted by price low to high, and make new collection
    const querySortByPrice = [
        {$match: {itemID:{$all:[Number(itemID)]}}},
        {$sort: {price: 1}},
        {$out: cheapSalesCollectionName}
    ];

    await salesCollection.aggregate(querySortByPrice).forEach((docs2) => {
        console.log("docs2's id is " + docs2._id);
       });
    //await salesCollection.find().forEach((docs2) => {
     //   console.log("docs2's id is " + docs2._id);
    //});

    //aggregate query to extract delete id from cheapsalescollection
    const queryExtractDeleteId = [
        {$group: {
            _id: "$url", 
            date: {$max: "$date"}, 
            del:{$push:{id: "$_id"}}
        }}, 
        {$unwind : "$del" }
    ];
    /**
    const getAllDeleteId = async (cheapSalesCollection) => {
        const deleteIds = [];
        await cheapSalesCollection.aggregate(queryExtractDeleteId).forEach((docs) => {
            if (typeof docs == "object") {
                if ("del" in docs) {
                    if ("id" in docs.del) deleteIds.push(docs.del.id);
                }  
            }
        });
        return deleteIds;
    }

    const cheapSalesCollection = db.collection(cheapSalesCollectionName);
    const bulk = cheapSalesCollection.initializeUnorderedBulkOp();

    for (deleteId of await getAllDeleteId(cheapSalesCollection)) {
        bulk.find({ _id: deleteId}).removeOne();
    }
    //if (bulk.length) await bulk.execute();
 
    //await getAllDeleteId(cheapSalesCollection);
     */
    client.close();
    console.log("MongoDB Close");
}


// for test 
let salesCollection = process.argv[2];
let itemID = process.argv[3];
createCollectionSortedbyPrice(salesCollection, itemID);