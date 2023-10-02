var searchInput = document.querySelector("#searchbar");
var searchBtn = document.querySelector("#startButton");
var searchForm = document.querySelector("#search-form");
var results = document.querySelector("#results");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  var searchQuery = searchInput.value.trim();

  if (searchQuery) {
    getSearchResults(searchQuery);

    searchInput.value = "";
  } else {
    alert("Please enter a valid search!");
  }
});

function getSearchResults(input) {
  var apiUrl =
    "https://www.googleapis.com/youtube/v3/search?q=" +
    input +
    "&part=snippet" +
    "&type=video&key=AIzaSyCQJvOLH9jBWq_H_heswP8ew3OEFU99560";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        showResults(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
}

function showResults(data) {
  console.log(data);
  data.items.forEach((searchResults) => {
    var videoUrl =
      "https://www.youtube.com/watch?v=" + searchResults.id.videoId;
    var videoTitle = searchResults.snippet.title;
    var videoDescription = searchResults.snippet.description;

    var thumbnailUrl = searchResults.snippet.thumbnails.default.url

    var article = document.createElement("article");
    article.classList.add("media")

    var thumbnailEl = document.createElement("figure");
    thumbnailEl.classList.add("media-left")

    var thumbnailImg = document.createElement("p");
    thumbnailImg.classList.add("image", "is-64x64");

    var thumbnail = document.createElement("img");
    thumbnail.setAttribute("src", thumbnailUrl);

    var mediaContent = document.createElement("div");
    mediaContent.classList.add("media-content");

    var content = document.createElement("div");
    content.classList.add("content");

    var resultsEl = document.createElement("a");
    resultsEl.setAttribute("href", videoUrl);

    var videoInfo = document.createElement("p");
    videoInfo.innerHTML = "<strong>" + videoTitle + "</strong>" + "<br />" + videoDescription;

    results.appendChild(resultsEl);
    resultsEl.appendChild(article);
    
    article.appendChild(thumbnailEl);
    thumbnailEl.appendChild(thumbnailImg);
    thumbnailImg.appendChild(thumbnail);

    article.appendChild(mediaContent);
    mediaContent.appendChild(content);
    content.appendChild(videoInfo);
  });
}
