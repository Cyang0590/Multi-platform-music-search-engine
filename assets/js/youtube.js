var searchInput = document.querySelector("#searchbar");
var searchBtn = document.querySelector("#startButton");
var searchForm = document.querySelector("#search-form");
var results = document.querySelector("#results");
var searchHistorySection = document.getElementById("search-history");
var selectElement = document.querySelector("select");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  var searchQuery = searchInput.value.trim();

  var selectedGenre = selectElement.value;

  console.log(selectedGenre);
  if (searchQuery) {
    saveSearch(searchQuery);
    getSearchResults(searchQuery, selectedGenre);
    displaySearchHistory();

    searchInput.value = "";
    results.innerHTML = "";
  } else {
    alert("Please enter a valid search!");
  }
});

function saveSearch(input) {
  var searchHistory = localStorage.getItem("searchHistory");

  searchHistory = searchHistory ? JSON.parse(searchHistory) : [];

  var existingSearchIndex = searchHistory.findIndex(
    (search) => search.toLowerCase() === input.toLowerCase()
  );

  if (existingSearchIndex >= 0) {
    searchHistory.splice(existingSearchIndex, 1);
  }

  var firstLetter = input.charAt(0);
  var firstLetterCap = firstLetter.toUpperCase();
  var remainingLetters = input.slice(1);
  var capitalizeWord = firstLetterCap + remainingLetters;
  searchHistory.push(capitalizeWord);

  if (searchHistory.length > 10) {
    searchHistory.shift();
  }

  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function displaySearchHistory() {
  var searchHistory = localStorage.getItem("searchHistory");

  searchHistory = searchHistory ? JSON.parse(searchHistory) : [];

  searchHistorySection.innerHTML = "";

  searchHistory.forEach((search) => {
    var listItem = document.createElement("li");
    listItem.classList.add("menu-list");
    listItem.style.cursor = "pointer";
    listItem.innerHTML = "<a>" + search + "</a>";
    listItem.addEventListener("click", () => {
      var selectedGenre = selectElement.value;
      getSearchResults(search, selectedGenre);
      searchInput.value = "";
      results.innerHTML = "";
    });
    searchHistorySection.appendChild(listItem);
  });
}

function getSearchResults(input, genre) {
  var apiUrl =
    "https://www.googleapis.com/youtube/v3/search?q=" +
    input +
    "&part=snippet&type=video&maxResults=20&topicId=" +
    genre +
    "&key=AIzaSyCQJvOLH9jBWq_H_heswP8ew3OEFU99560";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        showResults(data);
        console.log(apiUrl);
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
    var thumbnailUrl = searchResults.snippet.thumbnails.default.url;
    var videoId = searchResults.id.videoId;

    var article = document.createElement("article");
    article.classList.add("media");
    article.style.cursor = "pointer";

    var thumbnailEl = document.createElement("figure");
    thumbnailEl.classList.add("media-left");

    var thumbnailImg = document.createElement("p");
    thumbnailImg.classList.add("image", "is-64x64");

    var thumbnail = document.createElement("img");
    thumbnail.setAttribute("src", thumbnailUrl);

    var mediaContent = document.createElement("div");
    mediaContent.classList.add("media-content");

    var content = document.createElement("div");
    content.classList.add("content");

    // var resultsEl = document.createElement("a");
    // resultsEl.setAttribute("href", videoUrl);

    var videoInfo = document.createElement("p");
    videoInfo.innerHTML =
      "<strong>" + videoTitle + "</strong>" + "<br />" + videoDescription;

    // results.appendChild(resultsEl);
    results.appendChild(article);

    article.appendChild(thumbnailEl);
    thumbnailEl.appendChild(thumbnailImg);
    thumbnailImg.appendChild(thumbnail);

    article.appendChild(mediaContent);
    mediaContent.appendChild(content);
    content.appendChild(videoInfo);

    article.addEventListener("click", function () {
      document.getElementById("modal1").classList.add("is-active");

      var modalTitle = document.querySelector("#modalTitle");
      modalTitle.innerHTML = videoTitle;

      var ytplayer = document.querySelector("#player");
      ytplayer.setAttribute("src", "https://www.youtube.com/embed/" + videoId);

      var tag = document.createElement("script");

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player("player", {
          playerVars: {
            playsinline: 1,
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }
    });
  });
}

// Function to close the modal
function closeModal() {
  document.getElementById("modal1").classList.remove("is-active");
}

// Add event listeners to close the modal
// whenever user click outside modal
document
  .querySelectorAll(
    ".modal-background, .modal-close, .modal-card-head.delete, .modal-card-foot.button"
  )
  .forEach(($el) => {
    const $modal = $el.closest(".modal");
    $el.addEventListener("click", () => {
      // Remove the is-active class from the modal
      $modal.classList.remove("is-active");
    });
  });

// Adding keyboard event listeners to close the modal
document.addEventListener("keydown", (event) => {
  const e = event || window.event;
  if (e.keyCode === 27) {
    // Using escape key
    closeModal();
  }
});

displaySearchHistory();
