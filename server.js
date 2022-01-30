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
const verifyUser = require('./auth.js');



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

app.get('/', (req, res) => {
  res.send('Servers Up! 🤗');
});

app.get('/books', handleGetBooks);
app.post('/books', handlePostBooks);
app.delete('/books/:id', handleDeleteBooks);
app.put('/books/:id', handlePutBooks);
app.get('/user', handleGetUser)

// to use verification functionality, paste your existing code inside of this function:
// verifyUser(req, async (err, user) => {
//   if (err) {
//     console.error(err);
//     res.send('invalid token');
//   } else {
//     // insert try catch logic here.  BE CAREFUL.  check syntax IMMEDIATELY
//   }
// });

async function handleGetBooks(req, res) {
  // let queryObject = {};

  // if (req.query.email) {
  //   queryObject = {
  //     email: req.query.email
  //   };
  // }

  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      try {
        let booksFromDb = await Book.find({ email: user.email });

        if (booksFromDb.length > 0) {
          res.status(200).send(booksFromDb);
        } else {
          res.status(404).send('No books found...☹️');
        }
      } catch (err) {
        res.status(500).send('Server Error...😩');
      }
    }
  });
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

async function handleDeleteBooks(req, res) {

  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      let id = req.params.id;
      try {
        const book = await Book.findOne({ _id: id, email: user.email });
        if (!book) {
          res.status(400).send('unable to update book');
        } else {
          await Book.findByIdAndDelete(id);
          res.status(200).send('cant delete');
        }
      } catch (err) {
        res.status(404).send(`unable to delete ${id}`);
      }
    }
  });
}




async function handlePutBooks(req, res) {
  let id = req.params.id;
  let email = req.query.email;
  try {
    const book = await Book.findOne({ _id: id, email });
    if (!book) {
      res.status(400).send('unable to update book');
    } else {
      let updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true, overwrite: true });
      res.status(200).send(updatedBook);
    }
  } catch (err) {
    res.status(404).send(`unable to delete ${id}`);
  }
}


function handleGetUser(req, res) {
  verifyUser(req, (err, user) => {
    if (err) {
      console.log(err);
      res.send('invalid token');
    } else {
      res.send(user);
    }
  });
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
