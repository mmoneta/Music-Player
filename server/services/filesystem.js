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

const convert_base64_to_file = function(path, base64) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, base64, 'base64', function(err) {
      if (err) reject(err);
      resolve('FILE-UPLOADED');
    });
  });
}

module.exports = {
  create_folder: create_folder,
  read_directory: read_directory,
  convert_base64_to_file: convert_base64_to_file
}