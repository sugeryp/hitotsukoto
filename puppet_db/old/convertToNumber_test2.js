const ObjectId = require('mongodb').ObjectID;

const MongoClient = require('mongodb').MongoClient;

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';

// MongoDB update

let tmpIds = [];
const updatePriceUndigit2Digit = (daCollection, keyword, ulp, llp) => {

    //connect to MongoDB
    MongoClient.connect(url, async (err, client) => {

        //destination of DB
        const db = client.db('puppet_test');

        // execute find
        const collection = db.collection(daCollection);

        //const query = {price: new RegExp("\\D")};
        const queryUnDigit = { price: /\D/ };
        //const query = {price: new RegExp(`${keyword}`)};
        //const query = {title: new RegExp(keyword, "g")};
        // define zenkaku-converter
        const zenkakuNumber2Hankaku = (str) => {
            return str.replace(/[０-９]/g, (s) => {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            });
        };

        const deleteUnDigitWord = (str) => {
            return str.replace(/\D/g, "");
        };
        let i = 0;
        //const bulk = collection.initializeUnorderedBulkOp();
        await collection.find(queryUnDigit).forEach((docs) => {
            if (typeof docs == "object") {
                if ("price" in docs) {
                    let price = zenkakuNumber2Hankaku(docs.price);
                    if (price) {
                        let digitPrice = deleteUnDigitWord(price);
                        console.log(docs._id.toHexString());
                        console.log(typeof docs._id.toHexString());
                        //console.log(typeof docs._id);
                        //const d_id = ObjectId(docs._id);                
                        //console.log(d_id);
                        //console.log(typeof d_id);
                        //const testQuery = {_id: d_id};
                        //console.log(d_id.equals(docs._id));
                        //tmpIds[i] = docs._id
                        //i = i++;
                        //console.log(digitPrice);
                        //bulk.find({_id:docs._id}).updateOne({$set:{price:digitPrice}});
                        /**
                        const d_id = {_id:ObjectId(docs._id.toHexString())};
                        collection.find(d_id).each(function(err, docs2) {
                            console.log(docs2._id);
                        });
                         */
                        tmpIds[i] = { _id: ObjectId(docs._id.toHexString()) };
                        i = i++;
                    }
                }  
            }
            else {
                console.log(docs);
            }
        }).then(async () => {
            for(i = 0; i <= tmpIds.length; i++){
                await collection.find(tmpIds[i]).forEach((docs2) => {
                    console.log("docs2's id is " + docs2._id);
                });
                //console.log("tmp Ids is " + typeof tmpIds[i]);
            }
        }, (err) =>{console.error(err)});
        client.close();
        console.log("MongoDB Close");

    });
};
/**
bulk.execute(function(err, result) {
    if(err){
        console.error(err);
    }
    console.log(result);
});
*/
let daCollection = process.argv[2];
let keyword = process.argv[3];

console.log(keyword);

updatePriceUndigit2Digit(daCollection, keyword);

setTimeout(() => {
    console.log(tmpIds.length);
}, 60000);



/**
MongoClient.connect(url, function(err, client) {

    //destination of DB
    const db = client.db('puppet_test');

    // execute find
    const collection = db.collection(daCollection);
    for(j=0; j < tmpIds.length; j++){
        collection.find({_id: tempIds[j]}, function(err, docs2) {
            console.log(j);
            console.log(docs2._id);
        })
    }
});

*/