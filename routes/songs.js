const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const pool = require('../database');
/* 
    BASE URL /tasks
    GET / - Get all tasks
    POST / - Create a new task
    GET /:id - Get a task by id
    PUT /:id - Update a task by id
    DELETE /:id - Delete a task by id
*/
router.get('/', async (req, res, next) => {
    await pool
        .promise()
        .query('SELECT * FROM leoseg_songs')
        .then(([rows, fields]) => {
            res.render('songs.njk', {
                songs: rows,
                title: 'songs',
                layout: 'layout.njk',
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                songs: {
                    error: 'Error getting songs',
                },
            });
        });
});

router.post('/', async (req, res) => {
    const song = req.body.song;

    await pool.promise()
    .query('INSERT INTO leoseg_songs (body) VALUES(?)', [song])
    .then((response) => {
        if (response[0].affectedRows == 1) {
            res.redirect('/songs');
        } else {
            res.status(400).json({
                songs: {
                    error: 'Invalid song'
                }
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            songs: {
                error: 'Invalid song'
            }
        })
    });
});


module.exports = router;

/*
    await pool
    .promise()
    .query('SELECT * FROM users')
    .then(([rows, fields]) => {
        res.json({
            data: rows,
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: 'Database error',
        });
    });
    */