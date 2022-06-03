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

router.post('/signup', async function (req, res, next) {
  const username = req.body.user;
  const password = req.body.password;

  bcrypt.hash(password, 10, async function (err, hash) {
      await pool.promise()
          .query('INSERT INTO leoseg_login (user, password) VALUES (?,?)', [username, hash])
          .then(([rows, fields]) => {
              req.session.user = username;
              res.redirect("/");
          }).catch(err => {
              console.log(err)
          });
  });
})


module.exports = router;