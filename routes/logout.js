var express = require('express');
var router = express.Router();
const pool = require('../database');

router.get('/', function (req, res, next) {
    req.session.destroy();
    console.log(req.session);
    res.redirect('/');
});


module.exports = router;