const express = require('express'),
router = express.Router(),
db = require('../database/db');

/* CREATE OF USER'S ALBUMS */
router.post('/list', function (req, res) {
  const { username } = req.body;
  db.Operations.SelectWhere(db.Models.Album, { username: username }).then(albums => res.send(albums));
});

module.exports = router;