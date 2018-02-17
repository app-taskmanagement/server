require('dotenv').config();

const express       = require('express');
const logger        = require('morgan');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const cors          = require('cors');
const config        = require(__dirname + '/config/config.js')['mongodb_atlas'];

var app = express();

mongoose.connect(config.urlDatabase, err => {
  if (!err) {
    console.log('connected to server atlas mongo');
  } else {
    console.error(err.message);
  }
})

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
