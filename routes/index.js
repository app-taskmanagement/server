const express = require('express');
const router  = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { message: 'Please see document route list on API on https://github.com/app-taskmanagement/server' });
});

module.exports = router;
