const MongoClient = require('mongodb').MongoClient;

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';

// test insert

const insertOne = function(req, res){

    //connect to MongoDB
    MongoClient.connect(url, function(err, client) {

        //destination of DB
        const db = client.db('puppet_test');

        //inserted test document
        var document = {name: "comera", price: 30000 , URL: "https://www.lll.jp"};

        //execute insertOne
        db.collection('test1').insertOne(
            document
        );

        //close MongoDB
        client.close();
        console.log("MongoDB Close");

	});
};

insertOne();
