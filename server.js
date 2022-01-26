'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

//Import mongoose
const mongoose = require('mongoose');

//Connect mongoose
mongoose.connect(process.env.DB_URL);

//Bring in our Book Schema if we want to use the Cat models

const Book = require('./model/book');



// Connection Validation
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/test', (request, response) => {

  response.send('test request received');

});

app.get('/books', handleGetBooks);
app.post('/books', handlePostBooks);

async function handleGetBooks(req, res) {
  let queryObject = {};

  if (req.query.email) {
    queryObject = {
      email: req.query.email
    };
  }



  try {
    //return all the results with empty object or get books from the same user email
    let booksFromDb = await Book.find(queryObject);

    if (booksFromDb.length > 0) {
      res.status(200).send(booksFromDb);
    } else {
      res.status(404).send('No books found...☹️');
    }
  } catch (err) {
    res.status(500).send('Server Error...😩');
  }
}

async function handlePostBooks(req, res) {
  console.log(req.body);
  try {
    const booksWeNeed = await Book.create(req.body);
    console.log('Hi from handle Get Posts');
    res.status(201).send(booksWeNeed);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something\'s wrong with the server!😭');
  }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
