var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200);
  res.send('Done.');
  console.log("getting dans attention");
});

module.exports = router;
