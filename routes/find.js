var express = require('express');
var router = express.Router();
var ytdl = require('ytdl-core');

/* GET home page. */
router.get('/find', function(req, res, next) {
    res.send("Hello there");
    var URL = req.query.URL;

    if (URL === undefined) {
        
    } else {

        ytdl.getBasicInfo(URL, function(err, info) {

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

module.exports = router;
