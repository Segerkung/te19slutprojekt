var express = require('express');
var router = express.Router();
var session = require('express-session');
const pool = require('../database');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session.uid);
  let data= {
    layout: 'layout.njk'
  }
  res.render('login.njk', data);
});

router.post('/login', async (req, res, next) => {
  // { "song": "koda post" }
      const username = req.body.user;
      const password = req.body.password;

      await pool.promise()
          .query('select * FROM leoseg_login WHERE user = ?', [username])
          .then(([rows, fields]) => {
            if (rows.length === 0) {
              return res.send('Failed to login');
            }
       //     console.log(rows[0]);
            bcrypt.compare(password, rows[0].password, function(err,result) {
              console.log(result);
              if (result) {
                req.session.username = username;
                req.session.user_id = rows[0].id;
                console.log(req.session.user_id);
                return res.redirect('/profile');
              } else {
                return res.send('Failed to login');
              }
            });
              
          })
          .catch(err => {
              console.log(err);
              res.status(500).json({
                  song: {
                      error: 'Failed to login'
                  }
              })
          });
  
  // res.json(req.body);

});



module.exports = router;