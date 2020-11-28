const { ObjectId } = require("mongodb");

const MongoClient = require("mongodb").MongoClient;

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';
const dbName = "puppet_test";

const getId = async (url, dbName, collectionName, filter) => {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true});
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const findIds = [];
    let findObjectIds = [];
    let orders = [];
    await collection.find(filter).sort({_id: 1}).forEach(doc => {
        findIds.push(parseInt(String(doc._id).substr(18), 16));
        findObjectIds.push(doc._id);
    })
    findObjectIds.forEach(objectId => {
        let order = -1
        collection.find({ _id: { $lte: objectId } }).count(true, {}, (err, count) => {
            order = count;
            if (order != -1) {
                orders.push(order);
            }
        })
    });
    await client.close();
    return {Ids: findIds, orders: orders, ObjectIds: findObjectIds[0], test: Object.entries(findObjectIds[0]), test2: findObjectIds[0].toString(), test3: findObjectIds[0].toString.toString(), test4: ObjectId.toString(), test5: findObjectIds[0].prototype, test6: ObjectId.prototype, test7: Object.getPrototypeOf(findObjectIds[0]).toString.toString()}
}


getId(url, dbName, "items", {item_name:"あっぽー4"}).then(res => {console.log(res)});