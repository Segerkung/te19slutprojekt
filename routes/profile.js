var express = require('express');
var router = express.Router();
const pool = require('../database');

router.get('/', async (req, res, next) => {
    if (!req.session.username) return res.redirect("/login");
    console.log(req.session.user_id);
    await pool.promise()
        .query('SELECT * FROM leoseg_songs WHERE user_id = ?', [req.session.user_id])
        .then(([rows, fields]) => {
            res.render('profile.njk', {
                songs: rows, 
                title: 'songs',
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
    const song = req.body.song;

    await pool.promise()
    .query('INSERT INTO leoseg_songs (songs, user_id) VALUES (?,?)', [song, req.session.user_id])
    .then((response) => {
        if (response[0].affectedRows == 1) {
            res.redirect('/profile');
        } else {
            res.status(400).json({
                song: {
                    error: 'Invalid song'
                }
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            songs: {
                error: 'Invalid songs'
            }
        })
    });
});

router.get('/:id/delete', async (req,res,next) => {
    const id = req.params.id;
    await pool.promise()
    .query('DELETE FROM leoseg_songs WHERE id = ?', [id])
    .then((response) => {
        res.redirect('/profile');
    })
});

module.exports = router;