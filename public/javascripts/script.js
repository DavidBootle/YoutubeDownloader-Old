var downloadBtn = document.querySelector('.download-button');
var searchBtn = document.querySelector('.search-button');
var URLinput = document.querySelector('.url-input');
var videoContainer = document.querySelector('.video-container');
var videoTitle = document.querySelector('.video-title');
var videoThumbnail = document.querySelector('.video-thumbnail');
var quality = document.querySelector('.quality');

URLinput.addEventListener('input', () => {
    findVideo(URLinput.value);
});

searchBtn.addEventListener('click', () => {
    findVideo(URLinput.value);
})

downloadBtn.addEventListener('click', () => {
    console.log(`URL: ${URLinput.value}`);
    downloadVideo(URLinput.value);
});

function downloadVideo(URL) {
    window.location.href = `/download?URL=${URL}&title=${videoTitle.innerHTML}`;
}

function findVideo(URL) {
    fetch(`/find?URL=${URL}`, {
        method:'GET'
    }).then(res => res.json())
    .then(json => {
        if (json.title == "undefined" || json.thumbnail == "undefined") {
            videoContainer.style.display = "none";
        } else {
            videoContainer.style.display = "block";
            videoTitle.innerHTML = json.title;
            videoThumbnail.src = json.thumbnail;
            quality.innerHTML = "Highest available quality is " + json.quality;
        }
    });
}

document.onload = function () {
    findVideo(ULRinput.value);
}