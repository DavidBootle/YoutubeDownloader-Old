var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ytdl = require('ytdl-core');
var favicon = require('serve-favicon');

var app = express();

var indexRouter = require('./routes/index');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use('/', indexRouter);

app.get('/find', (req, res) => {
  var URL = req.query.URL;

  if (URL === undefined) {
    res.render('info', {title: 'Find Info Proxy'});
  } else {

    ytdl.getBasicInfo(URL, function (err, info) {

      if (info === undefined) {
        console.log(`${URL} is not a valid youtube video url.`);
        res.json({
          "title": "undefined",
          "thumbnail": "undefined"
        });
      } else {

        var title = info.player_response.videoDetails.title;

        var thumbnails = info.player_response.videoDetails.thumbnail.thumbnails;
        var thumbnail_maxres = "";

        for (index in thumbnails) {

          if (thumbnail_maxres == "") {
            thumbnail_maxres = thumbnails[index];
          } else if (thumbnails[index].width > thumbnail_maxres.width && thumbnails[index].height > thumbnail_maxres.height) {
            thumbnail_maxres = thumbnails[index];
          }
        }

        var formats = info.player_response.streamingData.formats;
        var format_maxres = "";

        for (index in formats) {

          if (format_maxres == "") {
            format_maxres = formats[index];
          } else if (formats[index].width > format_maxres.width && formats[index].height > format_maxres.height) {
            format_maxres = formats[index];
          }
        }

        res.json({
          "title": title,
          "thumbnail": thumbnail_maxres.url,
          "quality": format_maxres.qualityLabel
        });
      }

    });
  }
});

app.get('/download', (req, res) => {
  var URL = req.query.URL;

  if (URL === undefined) {
    res.render('info', {title: 'Download Proxy'});
  }
  var title = req.query.title;
  
  res.header('Content-Disposition', `attachment;filename="${title}.mp4"`);

  ytdl(URL, {format: 'mp4'}).pipe(res);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
