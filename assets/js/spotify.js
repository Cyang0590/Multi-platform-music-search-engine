var searchInputEl = document.querySelector("#searchbar");
var searchBtnEl = document.querySelector("#startButton");
var searchFormEl = document.querySelector("#search-form");
var spotifySelectEl = document.querySelector("#spotify");
var youtubeSelectEl = document.querySelector("#youtube");
var resultsEl = document.querySelector("#spotifyResults");
var selectElement = document.querySelector("select");
var loader = document.querySelector("#loader");
var isLoading = false;

var clientId = "2383905db5474844bcb1768d0aa73893";
var clientSecret = "798793c082c84d74a10e63bb7d6d604a";

var Url = "https://accounts.spotify.com/api/token";


var searchHistory = localStorage.getItem("searchHistory");


// listen for the submit event (when the user press the search botton)
searchFormEl.addEventListener("submit", (event) => {
  event.preventDefault();

  var searchQueryEl = searchInputEl.value.trim();

  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const selectedGenreData = selectedOption.getAttribute("data-genre");
  console.log(selectedGenreData);

  // check user selection for the platform and genre
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



// function to restreive teh access token
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
  // passing the access token to the retreiveKeyPlaylist function
  retreiveKeyPlaylist(access_token, input, genre);
  console.log(access_token);
}



async function retreiveKeyPlaylist(access_token, input, genre) {
  var loader = document.querySelector("#loader");
  loader.style.display = "block";

  console.log(input);
  var nextPageLink = "";
  loader.style.display = "block";

  async function fetchData(apiUrl) {
    var response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ` + access_token,
      },
    });

    if (response.status === 200) {
      var data = await response.json();
      return data;
    } else {
      document.getElementById("modal2").classList.add("is-active");
    }
  }

  // the function that adds additional results to the page 
  async function loadMore() {
    if (isLoading) {
      return; // Don't load more if already loading
    }

    isLoading = true;

    var nextPageData = await fetchData(nextPageLink);
    if (nextPageData) {
      displayResult(nextPageData);
      nextPageLink = nextPageData.tracks.next;
    } else {
      document.getElementById("modal2").classList.add("is-active");
    }
  }

  // additional result will be showed once the user scroll until the end of the list
  window.addEventListener(
    "scroll",
    () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 4) {
        loadMore();
      }
    },
    {
      passive: true,
    }
  );

  // Initial Fetch
  const initialResult = await fetchData(
    `https://api.spotify.com/v1/search?type=track,artist&q=` + input + genre
  );

  if (initialResult) {
    nextPageLink = initialResult.tracks.next;
    displayResult(initialResult);
  } else {
    document.getElementById("modal2").classList.add("is-active");
  }
}

// function for displaying the spotify section
function displayResult(data) {
  loader.style.display = "block";
  if (data.tracks.items.length === 0) {
    document.getElementById("modal2").classList.add("is-active");
    errorText.textContent = "No Spotify Results Found!";
    loader.style.display = "none";
  } else {
    // adding setTimeout function to display the loading information
    setTimeout(() => {
      for (i = 0; i < 20; i++) {
        var artistName = data.tracks.items[i].artists[0].name;
        var trackName = data.tracks.items[i].name;
        var trackImage = data.tracks.items[i].album.images[2].url;
        var trackUrl = data.tracks.items[i].external_urls.spotify;

        // console.log(data.tracks.items[i].href)


      var article = document.createElement("a");
      article.href = trackUrl
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
        MusicInfo.classList.add("media-description", "has-text-grey-darker");

        MusicInfo.innerHTML =
          "<strong>" +
          trackName +
          "</strong>" +
          "<br />" +
          "<span class='has-text-grey-dark'>" +
          artistName +
          "</span>";

        article.appendChild(mediaContent);
        mediaContent.appendChild(content);
        content.appendChild(MusicInfo);

        resultsEl.appendChild(article);
        article.appendChild(thumbnailEl);
        thumbnailEl.appendChild(thumbnailImg);
        thumbnailImg.appendChild(thumbnail);
      }
      isLoading = false;
      loader.style.display = "none";
    }, 1500);
  }
}

document.addEventListener("DOMContentLoaded", searchHistorySearch);

// adding clickable search histories
function searchHistorySearch() {
  var listItem = document.querySelectorAll("li");
  listItem.forEach((searchItem) => {
    searchItem.addEventListener("click", () => {
      // checking to see if the spotify box is checked
      if (spotifySelectEl.checked) {
        const selectedOption =
          selectElement.options[selectElement.selectedIndex];
        const selectedGenreData = selectedOption.getAttribute("data-genre");
        retreiveToken(searchItem.textContent, selectedGenreData);
        resultsEl.innerHTML = "";
      } else if (youtubeSelector.checked) {
        console.log("No spotify selected");
      } else {
        document.getElementById("modal2").classList.add("is-active");
        errorText.textContent = "Please Select a Platform!";
      }
      searchInput.value = "";
    });
  });
}