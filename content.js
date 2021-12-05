//'AIzaSyD80-B-IVojiKipon2pXqUd8uO5VCu4p84'
const apiKey = 'AIzaSyD80-B-IVojiKipon2pXqUd8uO5VCu4p84'

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}
function main() {
    //Get video info from Youtube API
    var videoId = youtube_parser(window.location.href);
    httpGetAsync(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`,
    (result) => {
        resultParsed = JSON.parse(result);
        let videoInfo = resultParsed.items[0].statistics;

        //Set the dislike count
        let likeElement = document.evaluate("//yt-formatted-string[contains(., 'Kan ikke lide')]", document, null, XPathResult.ANY_TYPE, null );
        let ThisElement = likeElement.iterateNext();
        ThisElement.innerHTML = videoInfo.dislikeCount;

        //Calculate the like to dislike percent
        let likeDislikePercent = videoInfo.likeCount/(parseInt(videoInfo.likeCount) + parseInt(videoInfo.dislikeCount))*100;

        //Make and insert the like-dislike percent as a element
        var ratioElement = document.createElement("p");
        var ratioText = document.createTextNode(Math.round(likeDislikePercent)+ "% likes");
        ratioElement.appendChild(ratioText);

        ThisElement.parentElement.insertBefore(ratioElement,ThisElement.parentElement.childNodes[0] );
        console.log("ran");
    })
}

main();
