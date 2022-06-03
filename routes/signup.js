var express = require('express');
var router = express.Router();
const pool = require('../database');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function (req, res, next) {
  let data = {
    layout: 'layout.njk'
  }
  res.render('signup.njk', data);
});

router.post('/', async (req, res, next) => {
  const username = req.body.name;
  let password = req.body.password;
  bcrypt.hash(password, 8, async function (err, hash) {
    await pool.promise()
      .query('INSERT INTO leoseg_songs (user,password) VALUES (?,?)', [username, hash])
      .then((response) => {
        console.log(response);
        if (response[0].affectedRows === 1) {
          res.redirect('/login');
        } else {
          res.status(400).redirect('/signup');
        }
      })
      .catch(err => {
        console.log(err);
        res.redirect('/signup');
      });
  });
});


module.exports = router;