const ytdl = require('ytdl-core');

export default class Homepage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            URL: "",
            videoDisplay: "none",
            videoTitle: "",
            thumbnailURL: "",
            qualityLabel: ""
        };

        // binding
        this.handleInput = this.handleInput.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }

    handleInput (event) {
        this.setState({URL: event.target.value});
        this.handleSearch();
    }

    handleSearch () {
        var URL = this.state.URL;

        let currentComponent = this;
        ytdl.getBasicInfo(URL, function (err, info) {
            if (err) {currentComponent.setState({
                videoDisplay: "none",
                videoTitle: "",
                thumbnailURL: "",
                qualityLabel: ""
            });} else {
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

                currentComponent.setState({
                    videoDisplay: "block",
                    videoTitle: title,
                    thumbnailURL: thumbnail_maxres.url,
                    qualityLabel: format_maxres.qualityLabel
                });
            }
        });
    }

    handleDownload () {

    }

    render() {
        return (
            <body>
            <h1 className={"heading"}>TheWeirdSquid's Youtube Downloader</h1>
            <input className={"url-input"} onInput={this.handleInput} type={"url"} placeholder={"Video URL e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"}/>
            <button className={"search-button"} onClick={this.handleSearch}>Search</button>

            <div className={"video-container"}>
                <hr/>
                <h1 className={"video-title"} contentEditable spellCheck={"false"}></h1>
                <img className={"video-thumbnail"}/>
                <p className={"quality"}></p>
                <button className={"download-button"}>Download</button>
            </div>
            <style global jsx>{`
            * {
                text-align: center;
            }
            .heading {
                font-family: sans-serif;
                text-align: center;
                font-size: 50px;
            }

            .url-input, .search-button {
                font-size: 1.3em;
                padding: 5px 10px;
            }

            .url-input {
                border-radius:4px 0px 0px 4px;
                width: 30em;
                text-align: left;
                border:2px solid #EEEEEE;
                background: #EEEEEE;
                outline:none;
            }
            .url-input:focus {
                border:2px solid #0485ff;
            }
            .search-button {
                border-radius:0px 4px 4px 0px;
                border:2px solid #0485ff;
                background: #0485ff;
                color:white;
            }
            .video-container {
                display: none;
                width: 50%;
                margin: 0 auto;
                margin-top: 30px;
                text-align: center;
            }
            .video-title {
                font-size: 20px;
                text-align: left;
                font-family: sans-serif;
            }
            .video-thumbnail {
                width: 100%;
            }
            .download-button {
                font-size: 1.3em;
                padding: 5px 10px;
                border:2px solid #0485ff;
                background: #0485ff;
                color:white;
                border-radius: 4px;
            }
            .quality {
                font-size: 1em;
                font-family: sans-serif;
            }
            `}</style>
            </body>
        );
    }
}