const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';

// MongoDB update

let tmpIds = [];
const updatePriceUndigit2Digit = function(daCollection, keyword, ulp, llp){

    //connect to MongoDB
    MongoClient.connect(url, function(err, client) {

        //destination of DB
        const db = client.db('puppet_test');

        // execute find
        const collection = db.collection(daCollection);
        const d_id = {_id:ObjectId("5f4cf9d1e98a26344065acba")};

        collection.find(d_id).each(function(err, docs) {
            if(docs) console.log(docs._id);
        });

        client.close();
        console.log("MongoDB Close");

    });
};

let daCollection = process.argv[2];
let keyword = process.argv[3];

console.log(keyword);

updatePriceUndigit2Digit(daCollection, keyword);