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
})

function getSearchResults(input) {
    var apiUrl = "https://www.googleapis.com/youtube/v3/search?q=" + input + "&part=snippet" + "&type=video&key=AIzaSyCQJvOLH9jBWq_H_heswP8ew3OEFU99560";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);

            var videoUrl = "https://www.youtube.com/watch?v=" + data.items[0].id.videoId;
            var videoTitle = data.items[0].snippet.title

            var resultsEl = document.createElement('a');
            resultsEl.setAttribute('href', videoUrl);
            
            var titleEl = document.createElement('span');
            titleEl.textContent = videoTitle;
        
            resultsEl.appendChild(titleEl);

            results.appendChild(resultsEl);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      });
}