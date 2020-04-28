const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const favicon = require('serve-favicon');
const path = require('path');
const serverless = require('serverless-http');
const favicon = require('serve-favicon');

const app = express();
const port = process.env.PORT || "3000";

// SERVER CODE STARTS HERE

app.use(cors());
app.use(favicon(`${__dirname}/public/favicon.ico`));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// code for homepage html
app.get('/', (req, res) => res.sendFile(path.join(`${__dirname}/site/index.html`)));

app.get('/download', (req, res) => {
    var URL = req.query.URL;
    var title = req.query.title;
    
    res.header('Content-Disposition', `attachment;filename="${title}.mp4"`);

    ytdl(URL, {format: 'mp4'}).pipe(res);
});

app.get('/find', (req, res) => {
    var URL = req.query.URL;

    ytdl.getBasicInfo(URL, function(err, info) {

        if (info === undefined) {
            console.log(`${URL} is not a valid youtube video url.`);
            res.json({
                "title": "undefined",
                "thumbnail": "undefined"
            })
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
})

app.get('/getinfo', (req, res) => {
    var URL = req.query.URL;

    ytdl.getBasicInfo(URL, function (err, info) {
        res.json(info);
    });
})

// SERVERLESS
app.get('/api/info', (req, res) => {
    res.send({ application: 'youtube-downloader', version: '1.0'});
});

app.post('/api/v1/getback', (req, res) => {
    res.send({ ...req.body });
  });


// LISTEN

app.listen(port, () => {
    console.log("Server started on port " + port + ".");
});

module.exports.handler = serverless(app);