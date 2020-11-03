const MongoClient = require('mongodb').MongoClient;

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';

const addItemId = async (itemCollectionName, salesCollectionName) => {

    const client = await MongoClient.connect(url, 
        { useUnifiedTopology: true }
    );
    const db = client.db('puppet_test');
    const salesCollection = db.collection(salesCollectionName);
    const bulk = salesCollection.initializeUnorderedBulkOp();

    const makeFindQuery = (requirements) => {
        let queryRequirements = 0;
        const findConditions = [];
        if (Number.isInteger(requirements.minPrice)) findConditions.push({ price: {$gte: requirements.minPrice}});
        if (Number.isInteger(requirements.maxPrice)) findConditions.push({ price: {$lte: requirements.maxPrice}});
        if (Array.isArray(requirements.keywords)) {      
            for (value of requirements.keywords) {
                // if keyword is number or string, add condition into query
                if (typeof value == "number" || typeof value == "string") {
                    findConditions.push({ title: new RegExp(value)});

                // if keyword is Or-conditions, make or-query and add or-query into query
                } else if (Array.isArray(value)) {
                    const orConditions = []
                    for (value of value) {
                        if (typeof value == "number" || typeof value == "string") {
                            orConditions.push({ title: new RegExp(value)});
                        // if keyword is And-conditions, make and-query and add And-query into or-query
                        } else if (Array.isArray(value)) {                     
                            const andConditions = [];
                            for (value of value) {
                                if (typeof value == "number" || typeof value == "string") {
                                    andConditions.push({ title: new RegExp(value)});
                                }
                            }
                            if (!(andConditions.length == 0)) orConditions.push({ $and: andConditions});
                        }
                    }
                    if (!(orConditions.length == 0)) findConditions.push({ $or: orConditions});
                }
            }     
        }
        if (!(findConditions.length == 0)) queryRequirements = { $and: findConditions};
        return queryRequirements;
    }

    const getAllItems = async (itemCollectionName) => {
        const itemCollection = db.collection(itemCollectionName);
        const items = [];
        await itemCollection.find().forEach((docs) => {
            if (typeof docs == "object") {
                if ("itemID" in docs && "Requirements" in docs) {
                    items.push(docs);
                }  
            }
        });
        return items;
    }
    /** for check
    for (item of await getAllItems(itemCollectionName)) {
        console.log(item.Requirements);
        console.log(makeFindQuery(item.Requirements).$and);
        await salesCollection.find(makeFindQuery(item.Requirements)).forEach((docs) => {console.log(docs)});
    }
     */

    for (item of await getAllItems(itemCollectionName)) {
        //console.log(makeFindQuery(item.Requirements));
        await salesCollection.find(makeFindQuery(item.Requirements)).forEach((docs) => {
            if (typeof docs == "object") {
                if ("_id" in docs && "itemID" in item) {
                   if (!("itemID" in docs)) {
                       bulk.find({ _id: docs._id}).updateOne(
                            { $set: { itemID: [item.itemID]} }
                        );
                    // push itemID, only if sales's document doesn't have item's itemID
                    } else if (docs.itemID.indexOf(item.itemID) == -1) { 
                        bulk.find({ _id: docs._id}).updateOne(
                            { $set: {[`itemID.${docs.itemID.length}`]: item.itemID}}
                        );
                    }
                }
            }
        });
    }

    if (bulk.length) await bulk.execute();
    client.close();
    return (bulk.length)
};

// for test 
let itemCollection = process.argv[2];
let salesCollection = process.argv[3];
addItemId(itemCollection, salesCollection).then((result) => {console.log("update:" + result)})