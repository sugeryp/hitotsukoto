const express = require('express');
const MongoClient = require('mongodb').MongoClient;
import {serchAmazonItems} from "./get_amazon_items.js";

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';
const dbName = "puppet_test";
const earphoneCollectionName = "earphone_ranking";
const itemCollectionName = "items";
const amazonCollectionName = "Amazon10"

const getItem = async (url, dbName, collectionName) => {

  const client = await MongoClient.connect(url, 
    { useUnifiedTopology: true }
  );
  
  const db = client.db(dbName);

  const collection = db.collection(collectionName);

  //aggregate query to make collection sales items are sorted by price low to high, and make new collection
  const queryGetItem = [
      {$match: {itemID:Number(itemID)}},
      {$limit: 1},
  ];

  const items = []
  await collection.aggregate(queryGetItem).toArray(docs => {
    for (doc of docs) {
        if ("price" in doc) {
          if ("title" in doc) {
            if ("url" in doc) {
              items.push({price: doc.price, title: doc.title, url: doc.url, collectionName: collectionName, itemID: itemID});
            }
          } 
        }
      }
  })
  await client.close();
  return items;
}

const resisterItemWithItemID = async (url, dbName, collectionName, doc) => {

  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db(dbName);
  await db.collection(collectionName).insertOne(doc)
}



app.get('/register', async (req, res) => {
  res.render('register.ejs');
});

app.post('/registered', async (req, res) => {

  const insertItem = {
    keywork: req.body.keyword,
    negative_keyword: req.body.negative_keyword,
    lower_price: req.body.lower_price,
    upper_price: req.body.upper_price,
    item_name: req.body.item_name
  }
  await resisterItemWithItemID(url, dbName, itemCollectionName, insertItem)
  console.log(req.body);
  res.redirect('/register');
});

app.get('/earphone', async (req, res) => {
  await getItem(url, dbName, earphoneCollectionName).then(items => {
    console.log(items);
    res.render('earphone.ejs', {items: [items]});
  });
});




/**
app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM items',
    (error, results) => {
      res.render('index.ejs', {items: results});
    }
  );
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO items (name) VALUES (?)',
    [req.body.itemName],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.post('/delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM items WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM items WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {item: results[0]});
    }
  );
});

app.post('/update/:id', (req, res) => {
  // 選択されたメモを更新する処理を書いてください
  connection.query(
    'UPDATE items SET name = ? WHERE id = ?',
    [req.body.itemName, req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
  // 以下の一覧画面へリダイレクトする処理を削除してください
});
*/
app.listen(3000);

console.log("start server at 3000")
