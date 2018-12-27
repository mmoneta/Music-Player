const express = require('express'),
router = express.Router(),
path = require('path'),
filesystem = require('../services/filesystem'),
multer = require('multer'),
storage = multer.memoryStorage(),
upload = multer({ storage: storage, limits: { fieldSize: 25 * 1024 * 1024 }}).single('file'),
__mainDir = path.join(__dirname, '..');

/* CREATE NEW ALBUM */
router.post('/create', function (req, res) {
  const path = `${__mainDir}/uploads/${req.body.username}/${req.body.album}`;
  filesystem.create_folder(path).then(result => {
    if (result)
      res.send({ alert: 'ALBUM-CREATED', reset: true });
    else
      res.send({ alert: 'ALBUM-EXIST' })
  })
});

/* LIST OF USER'S ALBUMS */
router.post('/list', function (req, res) {
  const path = `${__mainDir}/uploads/${req.body.username}/${req.body.album}`;
  filesystem.read_directory(path).then(albums => res.send(albums)).catch(console.error);
});

/* UPLOAD MUSIC FILE */
router.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log(err);
    }

    const path = `${__mainDir}/uploads/${req.body.username}/${req.body.album}/${req.body.trackname}.mp3`,
    base64Data = req.body.file.replace(/^data:audio\/mp3;base64,/, '');
    filesystem.convert_base64_to_file(path, base64Data).then(result => res.send({ alert: result })).catch(console.log);
  })
});

module.exports = router;