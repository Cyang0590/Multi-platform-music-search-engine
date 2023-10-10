var searchInput = document.querySelector("#searchbar");
var searchBtn = document.querySelector("#startButton");
var searchForm = document.querySelector("#search-form");
var results = document.querySelector("#youtubeResults");
var searchHistorySection = document.getElementById("search-history");
var selectElement = document.querySelector("select");
var errorText = document.querySelector("#errorText");
var youtubeSelector = document.querySelector("#youtube");
var spotifySelector = document.querySelector("#spotify");
var loader = document.querySelector("#loader");
var html = document.querySelector("html");
var body = document.querySelector('body');
var toggle = document.getElementById('theme-switcher');
var isLoadingYT = false;

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  var searchQuery = searchInput.value.trim();
  var selectedGenre = selectElement.value;

  if (searchQuery) {
    if (youtubeSelector.checked) {
      getSearchResults(searchQuery, selectedGenre);
      results.innerHTML = "";
      searchInput.value = "";
    } else if (spotifySelector.checked) {
      console.log("No youtube selected");
      searchInput.value = "";
    } else {
      document.getElementById("modal2").classList.add("is-active");
      errorText.textContent = "Please Select a Platform!";
    }
    saveSearch(searchQuery);
    displaySearchHistory();
  } else {
    document.getElementById("modal2").classList.add("is-active");
    errorText.textContent = "Please Enter a Valid Search!";
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

  var words = input.split(" ");

  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if (word) {
      var firstLetter = word.charAt(0);
      var firstLetterCap = firstLetter.toUpperCase();
      var remainingLetters = word.slice(1);
      var capitalizeWord = firstLetterCap + remainingLetters;
      words[i] = capitalizeWord;
    }
  }

  var capitalizedInput = words.join(" ");
  searchHistory.push(capitalizedInput);

  if (searchHistory.length > 5) {
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
      if (youtubeSelector.checked) {
        var selectedGenre = selectElement.value;
        getSearchResults(search, selectedGenre);
        results.innerHTML = "";
      } else if (spotifySelector.checked) {
        console.log("No youtube selected");
      } else {
        document.getElementById("modal2").classList.add("is-active");
        errorText.textContent = "Please Select a Platform!";
      }
      searchInput.value = "";
    });
    searchHistorySection.appendChild(listItem);
  });
}

async function getSearchResults(input, genre) {
  var nextPageToken = "";
  loader.style.display = "block";

  async function fetchData(apiUrl) {
    var response = await fetch(apiUrl);
    if (response.status === 200) {
      var data = await response.json();
      return data;
    } else {
      document.getElementById("modal2").classList.add("is-active");
    }
  }

  async function loadMoreResults() {
    if (isLoadingYT) {
      return; // Don't load more if already loading
    }

    var nextPageApiUrl =
      "https://www.googleapis.com/youtube/v3/search?q=" +
      input +
      "&part=snippet&type=video&maxResults=20&topicId=" +
      genre +
      "&key=AIzaSyCQJvOLH9jBWq_H_heswP8ew3OEFU99560" + // Replace with your actual API key
      "&pageToken=" +
      nextPageToken;

    isLoadingYT = true;

    var nextPageData = await fetchData(nextPageApiUrl);
    if (nextPageData) {
      showResults(nextPageData);
      nextPageToken = nextPageData.nextPageToken;
    } else {
      document.getElementById("modal2").classList.add("is-active");
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 4) {
        loadMoreResults();
      }
    },
    {
      passive: true,
    }
  );

  // Initial fetch
  var initialApiUrl =
    "https://www.googleapis.com/youtube/v3/search?q=" +
    input +
    "&part=snippet&type=video&maxResults=20&topicId=" +
    genre +
    "&key=AIzaSyCQJvOLH9jBWq_H_heswP8ew3OEFU99560"; // Replace with your actual API key

  var initialData = await fetchData(initialApiUrl);
  if (initialData) {
    showResults(initialData);
    nextPageToken = initialData.nextPageToken;
  } else {
    document.getElementById("modal2").classList.add("is-active");
  }
}

function showResults(data) {
  loader.style.display = "block";
  setTimeout(() => {
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
      thumbnailImg.classList.add("image", "is-flex", "is-align-items-center");

      var thumbnail = document.createElement("img");
      thumbnail.setAttribute("src", thumbnailUrl);
      thumbnail.style.height = "64px";

      var mediaContent = document.createElement("div");
      mediaContent.classList.add("media-content");

      var content = document.createElement("div");
      content.classList.add("content", "is-flex");

      var videoInfo = document.createElement("p");
      videoInfo.classList.add("is-clipped", "is-size-6", "media-description");
      videoInfo.innerHTML =
        "<strong>" + videoTitle + "</strong>" + "<br />" + videoDescription;

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
        ytplayer.setAttribute(
          "src",
          "https://www.youtube.com/embed/" + videoId
        );

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
    isLoadingYT = false;
    loader.style.display = "none";
  }, 1500);
}

// Function to close the modal
function closeModal() {
  document.getElementById("modal1").classList.remove("is-active");
  document.getElementById("modal2").classList.remove("is-active");
}

// Add event listeners to close the modal
// whenever user click outside modal
document
  .querySelectorAll(
    ".modal-background, .modal-close, .modal-card-head.delete, .modal-card-foot.button"
  )
  .forEach(($el) => {
    var $modal = $el.closest(".modal");
    $el.addEventListener("click", () => {
      // Remove the is-active class from the modal
      $modal.classList.remove("is-active");
    });
  });

// Adding keyboard event listeners to close the modal
document.addEventListener("keydown", (event) => {
  var e = event || window.event;
  if (e.keyCode === 27) {
    // Using escape key
    closeModal();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
    const $notification = $delete.parentNode;

    $delete.addEventListener('click', () => {
      $notification.parentNode.removeChild($notification);
    });
  });
});

displaySearchHistory();

toggle.addEventListener("click", () => {
    const bodyCheck = body.classList.contains('dark');
    if (bodyCheck) {
        body.className = '';
        html.className = '';
        localStorage.removeItem("mode");
    } else {
        localStorage.setItem("mode", "dark");
        body.className = "dark";
        html.className = "dark";
  }
})

if (localStorage.getItem("mode") == "dark") {
  darkMode();
}

function lightMode() {
  localStorage.setItem("mode", "light");
  body.className = "";
  html.className = "";
}

function darkMode() {
  localStorage.setItem("mode", "dark");
  body.className = "dark";
  html.className = "dark";
}