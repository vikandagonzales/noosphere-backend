const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') require('dotenv').load();

const app = express();
const port = process.env.PORT || 5000;

// TOOLS
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// USER ROUTES
app.use('/auth', require('./routes/auth'));

// DEFAULT ROUTE
app.use((req, res, next) => {
  return next({status: 404, message: 'Route not found'});
});

// ERROR HANDLING
app.use((err, req, res, next) => {
  const errorMessage = {};
  if (process.env.NODE_ENV !== 'production' && err.stack) errorMessage.stack = err.stack;
  errorMessage.status = err.status || 500;
  errorMessage.message = err.message || 'Internal Server Error';
  return res.status(errorMessage.status).send(errorMessage);
});

// SERVER
app.listen(port, () => {
  console.log(`Listening on port ${port} 🐽!`);
});