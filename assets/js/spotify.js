var searchInputEl = document.querySelector("#searchbar");
var searchBtnEl = document.querySelector("#startButton");
var searchFormEl = document.querySelector("#search-form");
var spotifySelectEl = document.querySelector("#spotify")
var youtubeSelectEl = document.querySelector("#youtube");
var resultsEl = document.querySelector("#spotifyResults");



var clientId = "2383905db5474844bcb1768d0aa73893";
var clientSecret = "798793c082c84d74a10e63bb7d6d604a"

var Url = "https://accounts.spotify.com/api/token"

var searchHistory = localStorage.getItem("searchHistory");


searchFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  
  var searchQueryEl = searchInputEl.value.trim();

  if (spotifySelectEl.checked) {
    retreiveToken(searchQueryEl);
    resultsEl.innerHTML = "";
  } else {
    return;
  }

});

async function retreiveToken(input) {

  const result = await fetch(Url, {
    method: 'POST',
    body: 'grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'

    }
  })
  const data = await result.json();
  access_token = data.access_token;
  // retreiveKeyGenres(access_token)
  retreiveKeyPlaylist(access_token, input)
  console.log(access_token)
};

// async function retreiveKeyGenres(access_token) {

//   const result = await fetch(`https://api.spotify.com/v1/browse/categories?` + searchInput, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ` + access_token

//     }
// })
// const data = await result.json();
// console.log(categories.items)
// retreiveKeyPlaylist(data)
// }


async function retreiveKeyPlaylist(access_token, input) {
  console.log(input)
  const result = await fetch(`https://api.spotify.com/v1/search?type=track,artist&q=` + input, {
    method: "GET",
    headers: {
      Authorization: `Bearer ` + access_token

    }
  })
  const data = await result.json();
  console.log(data.tracks.items)
  displayResult(data);
  // console.log(data);
};


function displayResult(data) {
  for (i = 0; i <= 20; i++) {
      console.log(data.tracks.items[i].artists[0].name);
      var artistName = data.tracks.items[i].artists[0].name;
      var trackName = data.tracks.items[i].name;
      var trackImage = data.tracks.items[i].album.images[2].url;
      var trackUrl = data.tracks.items[i].external_urls.spotify;

      // console.log(data.tracks.items[i].href)

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
      content.classList.add("content");
      // console.log(data.tracks.items[i].album.images[2])

      var MusicInfo = document.createElement("p");
      MusicInfo.innerHTML =
        "<strong>" + trackName + "</strong>" + "<br />" + artistName;

      resultsEl.appendChild(article);
      article.appendChild(thumbnailEl);
      thumbnailEl.appendChild(thumbnailImg);
      thumbnailImg.appendChild(thumbnail);

      article.appendChild(mediaContent);
      mediaContent.appendChild(content);
      content.appendChild(MusicInfo);

      article.addEventListener("click", function () {

        console.log(trackUrl);

        return window.location.href= trackUrl
      })

    }

  }





