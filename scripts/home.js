document.querySelector("#searchbtn").addEventListener("click", () => {
    searchVideo();
})

let videoSelected = JSON.parse(localStorage.getItem("videoSelected")) || {};

const videoContainer = document.querySelector("#videoContainer");

const api_key = `AIzaSyCQIgfMR0UBOuw_VxESoy3bPFskcl4Sfus`;

let trending_vid = JSON.parse(localStorage.getItem("trending")) || {};

// Function to show trending videos on window load

// window.onload = async () => {
//     try{
//         let trendingFetch = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=IN&maxResults=20&key=${api_key}`);
//         let trendingVideosData = await trendingFetch.json();
//         console.log(trendingVideosData);
//         localStorage.setItem("trending", JSON.stringify(trendingVideosData.items))
//         appendResults(trendingVideosData.items)
//     }
//     catch(e){
//         console.log(`error: ${e}`)
//     }
// }



// Function area to search and append videos
const searchVideo = async () => {
    try{
        const query = document.querySelector("#query").value;
        let fetchPromise = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&videoEmbeddable=true&q=${query}&key=${api_key}`)
        let responseData = await fetchPromise.json();
        console.log(responseData);
        document.querySelector("#msg").innerHTML = `Showing results for '${document.querySelector("#query").value}'`
        appendResults(responseData.items)
    }
    catch(e){
        console.log(`error: ${e}`)
    }
}


const appendResults = (data) => {
    videoContainer.innerHTML = null;
    data.forEach(({id, snippet: {title, description, channelTitle, thumbnails : {medium: {url}}}}) => {
        //console.log(videoId, title, description, url, channelTitle);
        if(id.videoId !== undefined){
            id = id.videoId;
        }
        let videoDiv = document.createElement("div");
        videoDiv.setAttribute("class", "videoDiv");

        let videoThumbnail = document.createElement("img");
        videoThumbnail.setAttribute("class", "videoThumbnail")
        videoThumbnail.src = url;

        let videoTitle = document.createElement("p");
        videoTitle.setAttribute("class", "videoTitle");
        videoTitle.innerText = title.substr(0,80);

        let videoChannel = document.createElement("p");
        videoChannel.setAttribute("class", "videoChannel");
        videoChannel.innerText = channelTitle;

        let videoPlay = document.createElement("img");
        videoPlay.setAttribute("class", "videoPlay");
        videoPlay.src = "https://www.freepnglogos.com/uploads/youtube-logo-hd-8.png";

        let videoInfo = document.createElement("div");
        videoInfo.setAttribute("class", "videoInfo");
        let channelLogo = document.createElement("div");
        let channelImg = document.createElement("img")
        channelImg.src = "https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-aspect-ratio-templates-vashivisuals-blog-12.png";
        channelLogo.append(channelImg);
        channelLogo.setAttribute("class", "channelLogo");

        let videoName = document.createElement("div");
        videoName.setAttribute("class", "videoName");
        videoName.append(videoTitle, videoChannel);
        videoInfo.append(channelLogo, videoName)

        videoDiv.append(videoThumbnail, videoPlay, videoInfo);

        videoDiv.addEventListener("click", () => {
            videoSelected.videoId = id;
            videoSelected.title = title;
            videoSelected.description = description;
            videoSelected.thumbnail = url;
            videoSelected.channelTitle = channelTitle;
            console.log(videoSelected);
            localStorage.setItem("videoSelected", JSON.stringify(videoSelected));
            setTimeout(() => {
                window.location.href = "playVideo.html";
            }, 500);
        })

        videoContainer.append(videoDiv);


    })
}

appendResults(trending_vid);