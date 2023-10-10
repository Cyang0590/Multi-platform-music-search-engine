var searchInputEl = document.querySelector("#searchbar");
var searchBtnEl = document.querySelector("#startButton");
var searchFormEl = document.querySelector("#search-form");
var spotifySelectEl = document.querySelector("#spotify");
var youtubeSelectEl = document.querySelector("#youtube");
var resultsEl = document.querySelector("#spotifyResults");
var selectElement = document.querySelector("select");

var clientId = "2383905db5474844bcb1768d0aa73893";
var clientSecret = "798793c082c84d74a10e63bb7d6d604a";

var Url = "https://accounts.spotify.com/api/token";


var searchHistory = localStorage.getItem("searchHistory");



searchFormEl.addEventListener("submit", (event) => {
  event.preventDefault();

  var searchQueryEl = searchInputEl.value.trim();

  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const selectedGenreData = selectedOption.getAttribute("data-genre");
  console.log(selectedGenreData);

  if (searchQueryEl) {
    if (spotifySelectEl.checked) {
      retreiveToken(searchQueryEl, selectedGenreData);
      resultsEl.innerHTML = "";
    } else if (youtubeSelectEl.checked) {
      console.log("No Spotify Selected");
    } else {
      document.getElementById("modal2").classList.add("is-active");
      errorText.textContent = "Please Select a Platform!";
    }
  } else {
    document.getElementById("modal2").classList.add("is-active");
    errorText.textContent = "Please Select a Platform!";
  }
});




async function retreiveToken(input, genre) {
  const result = await fetch(Url, {
    method: "POST",
    body:
      "grant_type=client_credentials&client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const data = await result.json();
  access_token = data.access_token;

  retreiveKeyPlaylist(access_token, input, genre);
  console.log(access_token);
}



async function retreiveKeyPlaylist(access_token, input, genre) {

  var isLoading = false;
  var loader = document.querySelector("#loader");
  loader.style.display = "block";

  console.log(input);
  const result = await fetch(
    `https://api.spotify.com/v1/search?type=track,artist&q=` + input + genre,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ` + access_token,
      },
    }
  );
  const data = await result.json();
  console.log(data.tracks.items);
  displayResult(data);
  console.log(data);
};



// function for displaying the spotify section
function displayResult(data) {
  for (i = 0; i < 20; i++) {
    var artistName = data.tracks.items[i].artists[0].name;
    var trackName = data.tracks.items[i].name;
    var trackImage = data.tracks.items[i].album.images[2].url;
    var trackUrl = data.tracks.items[i].external_urls.spotify;

    var article = document.createElement("article");
    article.classList.add("media");
    article.style.cursor = "pointer";

    var thumbnailEl = document.createElement("div");
    thumbnailEl.classList.add("media-right");

    var thumbnailImg = document.createElement("p");
    thumbnailImg.classList.add("image", "is-64x64");

    var thumbnail = document.createElement("img");
    thumbnail.setAttribute("src", trackImage);

    var mediaContent = document.createElement("div");
    mediaContent.classList.add("media-content");

    var content = document.createElement("div");
    content.classList.add("content", "has-text-right");
    // console.log(data.tracks.items[i].album.images[2])

    var MusicInfo = document.createElement("p");
    MusicInfo.classList.add("is-pulled-right", "media-description");

    MusicInfo.innerHTML =
      "<strong>" +
      trackName +
      "</strong>" +
      "<br />" +
      "<span class='is-align-items-end'>" +
      artistName +
      "</span>";

    article.appendChild(mediaContent);
    mediaContent.appendChild(content);
    content.appendChild(MusicInfo);

    resultsEl.appendChild(article);
    article.appendChild(thumbnailEl);
    thumbnailEl.appendChild(thumbnailImg);
    thumbnailImg.appendChild(thumbnail);

    article.addEventListener("click", function () {
      console.log(trackUrl);

      return (window.location.href = trackUrl);
    });
  }
}
