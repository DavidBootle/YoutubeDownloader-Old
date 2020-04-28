var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: "TheWeirdSquid's Youtube Downloader"
  });
});

module.exports = router;
