const MongoClient = require('mongodb').MongoClient;

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';

// MongoDB find
const find = function(daCollection, keyword, ulp, llp){

    //connect to MongoDB
    MongoClient.connect(url, function(err, client) {

        //destination of DB
        const db = client.db('puppet_test');

        // execute find
        const collection = db.collection(daCollection);
        
        const query = {title: new RegExp(`${keyword}`)};
        //const query = {title: new RegExp(keyword, "g")};

        collection.find(query).each(function(err, docs) {
            console.log(docs);
        });

        client.close();
        console.log("MongoDB Close");

	});
};

let daCollection = process.argv[2];
let keyword = process.argv[3];
let ulp =  process.argv[4];
let llp =  process.argv[5];

find(daCollection, keyword, ulp, llp);

