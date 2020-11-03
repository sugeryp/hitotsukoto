const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';

// test insert

const insertOne = function(req, res){

    //connect to MongoDB
    MongoClient.connect(url, function(err, client) {

        //check to connect db
        assert.equal(null, err);
        console.log("MongoDB Connect");

        //destination of DB
        const db = client.db('puppet_test');

        //inserted test document
        var document = {name: "camera", price: 30000 , URL: "https://www.lll.jp"};

        //execute insertOne
        db.collection('test1').insertOne(
            document,
            function(err, result) {

                //check to insert with assert
                assert.equal(null, err);
                assert.equal(1, result.insertedCount);
                //display result of inssert on console
                console.log("insertOne Success: " + result.insertedCount);  
            }

        );

        //close MongoDB
        client.close();
        console.log("MongoDB Close");

	});
};

insertOne();
