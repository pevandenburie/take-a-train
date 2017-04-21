var express = require('express');
var router = express.Router();
var logger = require('log4js').getLogger();

/* GET home page. */
router.get('/', function(req, res, next) {
  logger.info('action="get Take-A-Train home"');
  res.render('index', { title: 'Take A Train !' });
});

module.exports = router;
