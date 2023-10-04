var searchInput = document.querySelector("#searchbar");
var searchBtn = document.querySelector("#startButton");
var searchForm = document.querySelector("#search-form");
var results = document.querySelector("#results");



var clientId = "2383905db5474844bcb1768d0aa73893";
var clientSecret = "798793c082c84d74a10e63bb7d6d604a"

var Url = "https://accounts.spotify.com/api/token"



searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  var searchQuery = searchInput.value.trim();

  if (searchQuery) {
    retreiveToken(searchQuery);

    searchInput.value = "";
    results.innerHTML = "";
    // } else {
    //   alert("Please enter a valid search!");
  }
});

async function retreiveToken() {

  const result = await fetch(Url, {
    method: 'POST',
    body: 'grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'

    }
  })
  const data = await result.json();
  access_token = data.access_token;
  retreiveKeyPlaylist(access_token)
};




async function retreiveKeyPlaylist(access_token, searchInput) {

  const result = await fetch(`https://api.spotify.com/v1/search?type=track,artist&q=` + searchInput, {
    method: "GET",
    headers: {
      Authorization: `Bearer ` + access_token

    }
  })
  const data = await result.json();
  console.log(data);
  showSearchResults(data);
};

function showSearchResults(data) {

}




