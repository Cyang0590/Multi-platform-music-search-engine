var searchInput = document.querySelector("#searchbar");
var searchBtn = document.querySelector("#startButton");
var searchForm = document.querySelector("#search-form");
var results = document.querySelector("#results");

var clientId = "2383905db5474844bcb1768d0aa73893";
var clientSecret = "798793c082c84d74a10e63bb7d6d604a";

var tokenUrl = "https://accounts.spotify.com/api/token";

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  var searchQuery = searchInput.value.trim();

  if (searchQuery) {
    getToken(searchQuery);

    searchInput.value = "";
    results.innerHTML = "";
  } else {
    alert("Please enter a valid search!");
  }
});

function getToken(input) {
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body:
      "grant_type=client_credentials&client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var token = data.access_token;
        search(token, input);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
}

function search(token, input) {
  var searchUrl =
    "https://api.spotify.com/v1/search?type=album,track,artist&q=" + input;
  console.log(token);

  fetch(searchUrl, {
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        var trackUri = data.tracks.items[0].uri;
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
}


window.onSpotifyIframeApiReady = (IFrameAPI) => {
  const element = document.getElementById("embed-iframe");
  const options = {
    uri: "spotify:track:7FAFkQQZFeNwOFzTrSDFIh",
  };
  const callback = (EmbedController) => {
    
  };
  IFrameAPI.createController(element, options, callback);
};