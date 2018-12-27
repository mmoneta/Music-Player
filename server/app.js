const express = require('express'),
app = express(),
server = require('http').Server(app),
path = require('path'),
favicon = require('serve-favicon'),
logger = require('morgan'),
bodyParser = require('body-parser'),
auth = require('./routes/auth'),
album = require('./routes/album'),
albums = require('./routes/albums'),
__mainDir = path.join(__dirname, '..');

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__mainDir, 'dist/Music-Player')));
app.use('/users', express.static(path.join(__mainDir, 'dist/Music-Player')));
app.use('/auth', auth);
app.use('/album', album);
app.use('/albums', albums);

// Routing
app.get('*', function(req, res) {
  res.sendFile(`${__mainDir}/dist/Music-Player/index.html`);
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;