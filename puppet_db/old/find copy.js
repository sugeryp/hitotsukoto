const MongoClient = require('mongodb').MongoClient;

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';

// MongoDB find
const find = function(daCollection, keyword, ulp, llp){

    //connect to MongoDB
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {

        //assert connection

        console.log("MongoDB Connect");

        //destinate DB
        const db = client.db('puppet_test');

        console.log("use puppet_test");

        //destinate collection
        const collection = db.collection(daCollection);

        console.log("select connection");       

        //create condition
        const condition = {title: `/${keyword}/`};
        console.log(condition);  

        // execute find
        collection.find(condition).forEach(function(docs) {
            if(docs){
                //display result on console
                console.log(docs);
            }
        });

        //close MongoDB
        client.close();
        console.log("MongoDB Close");

	});
};

let daCollection = process.argv[2];
let keyword = process.argv[3];
let ulp =  process.argv[4];
let llp =  process.argv[5];

find(daCollection, keyword, ulp, llp);

