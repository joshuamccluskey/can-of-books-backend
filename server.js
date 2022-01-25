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
const res = require('express/lib/response');

// Connection Validation
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected')
});

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/test', (request, response) => {

  response.send('test request received');

});

app.get('/books', handleGetBooks);

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


app.listen(PORT, () => console.log(`listening on ${PORT}`));
