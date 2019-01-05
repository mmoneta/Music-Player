const express = require('express'),
router = express.Router(),
path = require('path'),
filesystem = require('../services/filesystem'),
multer = require('multer'),
storage = multer.memoryStorage(),
upload = multer({ storage: storage, limits: { fieldSize: 25 * 1024 * 1024 }}).single('file'),
db = require('../database/db'),
__mainDir = path.join(__dirname, '..');

/* CREATE NEW ALBUM */
router.post('/create', function (req, res) {
  const { username, album } = req.body,
  folder = album.split(' ').join('_'),
  album = new db.Models.Album({
    username: username,
    name: album,
    folder: folder
  });

  album.validate(err => console.log(err));
  db.Operations.InsertOne(album).catch(console.error);

  const path = `${__mainDir}/uploads/${username}/${folder}`;
  filesystem.create_folder(path).then(result => {
    if (result)
      res.send({ alert: 'ALBUM-CREATED', reset: true });
    else
      res.send({ alert: 'ALBUM-EXIST' })
  })
});

/* LIST OF TRACKS IN ALBUM */
router.post('/list', function (req, res) {
  const { username, album } = req.body;
  db.Operations.SelectWhere(db.Models.Track, { username: username, album: album }).then(tracks => res.send(tracks));
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
    
    const { username, album, trackname, file } = req.body,
    mimeType = filesystem.base64MimeType(file),
    mimeTypeSplited = mimeType.split('/'),
    filename = `${trackname.split(' ').join('_')}.${mimeTypeSplited[1]}`,
    path = `${__mainDir}/uploads/${username}/${album}/${filename}`,
    regExp = new RegExp(`^data:${mimeType};base64,`),
    base64Data = file.replace(regExp, ''),
    track = new db.Models.Track({
      username: username,
      album: album,
      name: trackname,
      file: filename
    });

    track.validate(err => console.log(err));
    db.Operations.InsertOne(track).catch(console.error);

    filesystem.convert_base64_to_file(path, base64Data).then(result => res.send({ alert: result })).catch(console.log);
  });
});

module.exports = router;