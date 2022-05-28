const videoSelected = JSON.parse(localStorage.getItem("videoSelected")) || {};
const videoContainer = document.querySelector("#videoContainer");
const relatedContainer = document.querySelector("#relatedContainer");
const api_key = `AIzaSyCQIgfMR0UBOuw_VxESoy3bPFskcl4Sfus`;
let video_items = JSON.parse(localStorage.getItem("items")) || {};

//console.log(video_items);

let {channelTitle, description, thumbnail, videoId, title} = videoSelected;

window.onload = () => {
    videoContainer.innerHTML = null;

    let videoFrame = document.createElement("iframe");
    videoFrame.setAttribute("id", "frame");
    videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
    videoFrame.allowFullscreen = "true";
    videoFrame.setAttribute("allow", "autoplay")

    let videoTitle = document.createElement("h2");
    videoTitle.innerText = title;
    videoTitle.setAttribute("id", "title")

    let videoDesc = document.createElement("p");
    videoDesc.innerText = description;
    videoDesc.setAttribute("id", "description")

    let channelName = document.createElement("p");
    channelName.innerText = channelTitle;
    channelName.setAttribute("id", "channel")

    videoContainer.append(videoFrame, videoTitle, channelName, videoDesc);
}

const getRelatedVideos = async () => {
    try{
        let fetchPromise = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=20&&key=${api_key}`);
        let relatedVideosData = await fetchPromise.json();
        console.log(relatedVideosData);
        video_items = relatedVideosData.items;
        localStorage.setItem("items", JSON.stringify(video_items));
        appendRelatedVideos(relatedVideosData.items);
    }
    catch(e){
        console.log(`error in fetching related vidoes: ${e}`)
    }
}

const appendRelatedVideos = (data) => {
    relatedContainer.innerHTML = null;
    let h3 = document.createElement("h3");
    h3.innerText = "Related videos";
    relatedContainer.append(h3);
    data.forEach((el) => {
        if(el.snippet !== undefined){
            let {id: {videoId}, snippet: {title, channelTitle, thumbnails: {default: {url}}}} = el;
            //console.log(title, videoId, url, channelTitle)

            let mainDiv = document.createElement("div");
            mainDiv.setAttribute("class", "mainDiv");

            let thumbnailDiv = document.createElement("div");
            thumbnailDiv.setAttribute("class", "thumbnailDiv");
            let thumbImg = document.createElement("img");
            thumbImg.src = url;
            thumbnailDiv.append(thumbImg);

            let videoInfoDiv = document.createElement("div");
            videoInfoDiv.setAttribute("class", "videoInfoDiv");

            let videoTitle = document.createElement("p");
            videoTitle.setAttribute("class", "videoTitle");
            videoTitle.innerText = title;

            let videoChannel = document.createElement("p");
            videoChannel.setAttribute("class", "videoChannel");
            videoChannel.innerText = channelTitle;

            videoInfoDiv.append(videoTitle, videoChannel);

            mainDiv.append(thumbnailDiv, videoInfoDiv);
            mainDiv.addEventListener("click", function(){
                videoSelected.videoId = videoId;
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
            relatedContainer.append(mainDiv);
        }
    })
}


// To optimize search quota not limited, commented out fetch function. Un-comment below function before use

//getRelatedVideos();

appendRelatedVideos(video_items);









/*

https://youtube.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=Vbu44JdN12s&type=video&key=AIzaSyCHp5ZGt0JcuV3VOXN5b7di3cVtL1PETKg

*/
