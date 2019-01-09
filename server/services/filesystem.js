const directoryExists = require('directory-exists'),
mkdirp = require('mkdirp-promise'),
fs = require('fs');

function check_exist(path) {
  return new Promise((resolve, reject) => {
   directoryExists(path, (error, result) => {
   	 if (error) reject(error);
     resolve(result);
   });
  })
}

const create_folder = async function(path) {
  var exist = await check_exist(path);
  if (!exist) {
    mkdirp(path).then(console.log).catch(console.error);
    return true;
  }
  return false;
}

const read_directory = function(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) reject(err);
      resolve(files);
    })
  })
}

const base64MimeType = function(encoded) {
  var result = null;

  if (typeof encoded !== 'string') {
    return result;
  }

  var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    result = mime[1];
  }

  return result;
}

const convert_base64_to_file = function(path, base64) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, base64, 'base64', function(err) {
      if (err) reject(err);
      resolve('FILE-UPLOADED');
    });
  });
}

const create_read_stream = function(res, path) {
  return new Promise(() => {
    const filestream = fs.createReadStream(path);

    filestream.on('open', function () {
      const stats = fs.statSync(path);

      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stats.size
      });
      filestream.pipe(res);
    });

    filestream.on('error', function (err) {
      filestream.end();
    }); 
  });
}

module.exports = {
  create_folder: create_folder,
  read_directory: read_directory,
  base64MimeType: base64MimeType,
  convert_base64_to_file: convert_base64_to_file,
  create_read_stream: create_read_stream
}