var searchInput = document.querySelector("#searchbar");
var searchBtn = document.querySelector("#startButton");
var searchForm = document.querySelector("#search-form");
var results = document.querySelector("#results");


var clientId = "2383905db5474844bcb1768d0aa73893";
var clientSecret = "798793c082c84d74a10e63bb7d6d604a"

var Url = "https://accounts.spotify.com/api/token"

 searchEl= (event) => {
    event.preventDefault();
    mySeacrh = searchInput.val()
    if (mySeacrh === null) {
        alert("Please enter a valid search!");
    };

fetch(Url , {
    method: 'POST',
    body: 'grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
.then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        var accessToken = data.access_token
      });
    } 
  });


}
  searchInput.addEventListener("click", searchEl)