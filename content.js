const apiKey = 'AIzaSyD80-B-IVojiKipon2pXqUd8uO5VCu4p84'

async function  getVideoInformation(callback) {
    return await httpGetAsync(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`)
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

var videoId = youtube_parser(window.location.href);
httpGetAsync(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`,
(result) => {
    result = JSON.parse(result);
    console.log(result);
    var videoInfo = result.items[0].statistics;
    var likeElement = document.evaluate("//yt-formatted-string[contains(., 'Kan ikke lide')]", document, null, XPathResult.ANY_TYPE, null );
    var ThisElement = likeElement.iterateNext();
    ThisElement.innerHTML = videoInfo.dislikeCount;
})

// console.log(document.getElementById("top-level-buttons-computed").childNodes);
// document.getElementById("top-level-buttons-computed").children[1].children[0].children[1].innerHTML =videoInfo.dislikeCount;




