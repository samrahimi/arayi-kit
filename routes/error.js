var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/error500', function(req, res, next) {
  res.send('oops');
});

module.exports = router;
