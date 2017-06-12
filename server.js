const express = require('express');
const bodyParser= require('body-parser')
const app = express();

app.use(bodyParser.json()) // handle json data
app.use(bodyParser.urlencoded({ extended: true }))

const MongoClient = require('mongodb').MongoClient

let db;

MongoClient.connect('mongodb://tassosb:lefti248@ds125262.mlab.com:25262/lyrical', (err, database) => {
  if (err) return console.log(err);
  db = database;

  app.listen(3000, function() {
    console.log('listening on 3000')
  }).on('error', function(err){
    console.log('on error handler');
    console.log(err);
  });
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/lyrics', (req, res) => {
  db.collection('lyrics').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database');
    res.send('succesful post');
  })
})

app.get('/counts/:word', (req, res) => {
  //query for count of words passed into req.
})
