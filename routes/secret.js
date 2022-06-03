var express = require('express');
var router = express.Router();
const pool = require('../database');


/* GET users listing. */

router.get('/', async (req, res, next) => {
  const username = req.session.username;
  if (username == undefined) {
    return res.redirect('/');
  }
  await pool.promise()
    .query('SELECT * FROM leoseg_songs')
    .then(([rows, fields]) => {
      res.render('secret.njk', {
        items: rows,
        title: 'secret',
        layout: 'layout.njk'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        songs: {
          error: 'Error getting songs'
        }
      })
    });
});

router.post('/', async (req, res, next) => {
  const body = req.body.body;
  const user_id = req.session.user_id;
  await pool.promise()
  .query('INSERT INTO leoseg_songs (body,user_id) VALUES (?,?)', [body,user_id])
  .then((response) => {
      console.log(response);
      if (response[0].affectedRows === 1) {
          res.redirect('/secret');
      } else {
          res.status(400).redirect('/secret');
      }
  })
  .catch(err => {
      console.log(err);
      res.redirect('/secret');
  });
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  const username = req.session.username;
  if (isNaN(id)) {
      res.redirect('/secret/');
  } else {
      await pool.promise()
          .query('SELECT songs.*,user.name FROM songs JOIN user ON user.id = songs.user_id WHERE songs.id = ?', [id])
          .then(([rows, fields]) => {
            if (rows[0].name == username) {
              console.log(rows);
              let data = {
                  message: "He llo",
                  layout: 'layout.njk',
                  title: 'Nunjucks example',
                  items: rows,
                };
                res.render('meepedit.njk', data);
            } else {
              res.redirect('/secret/');
            }
              
          })
          .catch(err => {
              console.log(err);
              res.status(500).json({
                  videos: {
                      error: 'Error getting meeps'
                  }
              })
          });
  }
});

router.post('/:id', async (req, res, next) => {
  const id = req.params.id;
  const body = req.body.body;
  if (isNaN(id)) {
      res.status(400).json({
          videos: {
              error: 'Bad request'
          }
      })
  } else {
      await pool.promise()
      .query('UPDATE meeps SET body = ? WHERE id = ?', [body,id])
      .then((response) => {
          console.log(response);
          if (response[0].affectedRows === 1) {
              res.redirect('/secret');
          } else {
              res.status(400).redirect('/secret' + id);
          }
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              videos: {
                  error: 'Error posting meeps'
              }
          })
      });
  }
});

router.get('/:id/delete/', async (req, res, next) => {
  const id = req.params.id;
  if (isNaN(req.params.id)) {
      res.redirect('/secret/');
  } else {
      await pool.promise()
          .query('DELETE FROM meeps WHERE id = ?', [id])
          .then((response) => {
              console.log(response);
              if (response[0].affectedRows === 1) {
                  res.redirect('/secret');
              } else {
                  res.redirect('/secret/' + id);
              }
          })
          .catch(err => {
              console.log(err);
              res.redirect('/secret/' + id);
          });
  }
});
module.exports = router;