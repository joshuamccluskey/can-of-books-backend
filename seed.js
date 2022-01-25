'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

const Book = require('./model/book');

async function seed() {

  await Book.create({
    title: 'Simulation Hypothesis',
    description: 'Book for lovers of sci-fi, computer science, and video games',
    status: true,
    email: 'rivkadavidowski@fakeuser.com'
  });
  console.log('Simulation Hypothesis saved');

  await Book.create({
    title: 'The Silmarillion',
    description: 'The mythos of Middle Earth.',
    status: true,
    email: 'roach.patrick.shane@gmail.com'
  });
  console.log('The Silmarillion saved');

  await Book.create({
    title: 'Catch-22',
    description: 'A satrical novel about the beauracy of the military.',
    status: false,
    email: 'jpiff57@gmail.com'
  });
  console.log('Catch-22 saved');


  mongoose.disconnect();
}

seed();
