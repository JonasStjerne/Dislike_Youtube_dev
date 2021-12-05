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
    resultParsed = JSON.parse(result);
    let videoInfo = resultParsed.items[0].statistics;

    let likeElement = document.evaluate("//yt-formatted-string[contains(., 'Kan ikke lide')]", document, null, XPathResult.ANY_TYPE, null );
    let ThisElement = likeElement.iterateNext();

    ThisElement.innerHTML = videoInfo.dislikeCount;
    let rationNumber = (videoInfo.likeCount/(videoInfo.likeCount + videoInfo.dislikeCount) * 100).toFixed(0);
    var ratioElement = document.createElement("p");
    var ratioText = document.createTextNode(rationNumber+ "% likes");
    ratioElement.appendChild(ratioText);
    ThisElement.appendChild(ratioElement);
})
