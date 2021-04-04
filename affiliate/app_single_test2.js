const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

// MongoDB Listener URL
const url = 'mongodb://localhost:27017';

const getItem = async (collectionName, itemID) => {

  const client = await MongoClient.connect(url, 
    { useUnifiedTopology: true }
  );
  
  const db = client.db('puppet_test');

  const collection = db.collection(collectionName);

  //aggregate query to make collection sales items are sorted by price low to high, and make new collection
  const queryGetItem = [
      {$match: {itemID:Number(itemID)}},
      {$limit: 1},
  ];

  return await collection.aggregate(queryGetItem).toArray().then(docs => {
    for (doc of docs) {
        if ("price" in doc) {
          if ("title" in doc) {
            if ("url" in doc) {
              return {price: doc.price, title: doc.title, url: doc.url, collectionName: collectionName, itemID: itemID}
            }
          } 
        }
      }
  })

}


app.get('/', async (req, res) => {
  await getItem("cheap_sales_itemID_1", 1).then(items => {
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
