require('dotenv').config()

const express       = require('express')
const path          = require('path')
const logger        = require('morgan')
const bodyParser    = require('body-parser')
const mongoose      = require('mongoose')
const cors          = require('cors')
const kue           = require('kue')
const kueUiExpress  = require('kue-ui-express')
const configRedis   = require(__dirname + '/config/config.js')['redis']
const configMongo   = require(__dirname + '/config/config.js')['mongodb_atlas']
const app           = express()

mongoose.connect(configMongo.urlDatabase, err => {
  if (!err) {
    console.log('connected to server atlas mongo');
  } else {
    console.error(err.message);
  }
})

const queue = kue.createQueue({
  prefix: 'queue',
  redis: configRedis
});

kueUiExpress(app, '/kue/', '/kue-api/')

kue.app.listen(configRedis.port)
queue.process('email', function(job, done) {
  send.email(job.data, (err, info) => {
    if (err) {
      console.log('error', err.message)
    } else {
      console.log(`success send email to ${job.data.to}`)
      done()
    }
  })
})

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/email-api', kue.app)
app.use('/', require('./routes/index'))
app.use('/api/users', require('./routes/users'))
// app.use('/api/tasks', require('./routes/tasks'))

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
