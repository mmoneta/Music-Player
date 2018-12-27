const express = require('express'),
router = express.Router(),
path = require('path'),
filesystem = require('../services/filesystem'),
__mainDir = path.join(__dirname, '..');

/* CREATE OF USER'S ALBUMS */
router.post('/list', function (req, res) {
  const path = `${__mainDir}/uploads/${req.body.username}`;
  filesystem.read_directory(path).then(albums => res.send(albums)).catch(console.error);
});

module.exports = router;