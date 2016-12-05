var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'arayikit - visualizing existence', footer: 'powered by the arayi set and the sour-candy rendering engine' });
})

router.get('/users', function(req, res, next) {
    res.render('index', { title: 'Users Page' });
}) 
 


/* GET home page. */
module.exports = router

