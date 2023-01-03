const rootElem = document.getElementById("root");
const episodesSelectTag = document.getElementById("episodes");
const showsSelectTag = document.getElementById("shows");
const resetBtn = document.querySelector(".btn-reset");
const homeBtn = document.querySelector(".btn-home");
const inputSearch = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
let showsTitles;
let allEpisodes = [];
let allShows = [];
let showId;

// .............Shows Related Functions.....................................................

// Fetch all shows from TVmaze API and load the page
function start() {
  fetch("https://api.tvmaze.com/shows")
    .then((response) => response.json())
    .then((data) => {
      allShows = data;
      getAllShows();
    });
}

// Get all shows and display them on the page + displays shows listing
function getAllShows() {
  makePageForShows(allShows);
  displayShowsList(allShows);
  showsTitles = document.querySelectorAll(".card__title--show");
  showsTitles.forEach((show) => {
    show.addEventListener("click", (e) => getShowById(e));
  });
}

// Loads shows cards
function makePageForShows(showsList) {
  rootElem.innerHTML = "";
  showsSelectTag.style.display = "block";
  let sectionElt = document.createElement("section");
  sectionElt.className = "section--shows";

  showsList.map((show) => {
    let cardElt = document.createElement("article");
    let titleElt = document.createElement("h2");
    let imgElt = document.createElement("div");
    let listElt = document.createElement("ul");
    let textElt = document.createElement("div");

    cardElt.classList.add("card", "card--show");
    titleElt.className = "card__title--show";
    titleElt.id = show.id;
    imgElt.className = "card__img--show";
    listElt.className = "card__info--show";
    textElt.className = "card__text--show";

    titleElt.textContent = show.name;
    imgElt.style.backgroundImage = `url(${show.image.medium})`;
    listElt.innerHTML = `      
            <li><b>Rated:</b> ${show.rating.average}</li>
            <li><b>Genres:</b> ${show.genres.join(" | ")}</li>
            <li><b>Status:</b> ${show.status}</li>
            <li><b>Runtime:</b> ${show.runtime}</li>`;
    textElt.innerHTML = show.summary;
    cardElt.append(titleElt, imgElt, listElt, textElt);
    sectionElt.appendChild(cardElt);
  });
  rootElem.appendChild(sectionElt);

  inputSearch.addEventListener("input", (e) => {
    getShowByWord(e, allShows);
  });
}

// Displays shows on dropdown menu
function displayShowsList(showsList) {
  showsList.sort((a, b) => {
    let aShowName = a.name.toLowerCase();
    let bShowName = b.name.toLowerCase();
    return aShowName < bShowName ? -1 : 1;
  });

  showsList.map((show) => {
    let option = document.createElement("option");
    option.innerText = show.name;
    option.value = show.id;
    showsSelectTag.appendChild(option);
  });
}

// Get show by id
function getShowById(e) {
  if (e.target.value) {
    showId = e.target.value;
  } else {
    showId = e.target.id;
  }

  // Fetch all episodes from TVmaze API by show ID
  fetch("https://api.tvmaze.com/shows/" + showId + "/episodes")
    .then((response) => response.json())
    .then((data) => (allEpisodes = data))
    .then(() => getAllEpisodes());
}

// search for show by word
function getShowByWord(e, showsList) {
  let word = e.target.value.toLowerCase();
  let filteredShows = showsList.filter(
    (show) =>
      show.name.toLowerCase().includes(word) ||
      show.summary.toLowerCase().includes(word)
  );

  // Displaying message only if the search input is not empty
  searchResults.innerText =
    e.target.value == "" ? "" : `Found ${filteredShows.length} shows`;

  // Displaying filtered shows
  if (filteredShows.length == 0) {
    rootElem.innerHTML = "No matching shows";
  } else {
    makePageForShows(filteredShows);
  }
}

// .............Episodes Related Functions.....................................................

// Get all Episodes and display them on the page + displays episodes listing
function getAllEpisodes() {
  makePageForEpisodes(allEpisodes);
  displayEpisodesList(allEpisodes);
}

// Loads episodes cards
function makePageForEpisodes(episodesList) {
  rootElem.innerHTML = "";
  showsSelectTag.style.display = "none";
  let sectionElt = document.createElement("section");
  sectionElt.className = "section--episodes";

  episodesList.map((episode) => {
    let cardElt = document.createElement("article");
    let titleElt = document.createElement("h2");
    let imgElt = document.createElement("div");
    let textElt = document.createElement("div");
    let episodeNum =
      episode.number < 10 ? "0" + episode.number : episode.number;
    let seasonNum = episode.season < 10 ? "0" + episode.season : episode.season;
    cardElt.classList.add("card", "card--episode");
    titleElt.className = "card__title--episode";
    imgElt.className = "card__img--episode ";
    textElt.className = "card__text--episode";
    titleElt.textContent = `${episode.name} - S${seasonNum}E${episodeNum}`;
    imgElt.style.backgroundImage = `url(${episode.image.medium})`;
    textElt.innerHTML = episode.summary;
    cardElt.append(titleElt, imgElt, textElt);
    sectionElt.appendChild(cardElt);
  });
  rootElem.appendChild(sectionElt);
  inputSearch.addEventListener("input", (e) => {
    getEpisodeByWord(e, allEpisodes);
  });
}

// Display episodes on dropdown menu
function displayEpisodesList(episodesList) {
  episodesSelectTag.innerHTML = `<option value="-1">Select episode</option>`;
  episodesList.map((episode) => {
    let option = document.createElement("option");
    let episodeNum =
      episode.number < 10 ? "0" + episode.number : episode.number;
    let seasonNum = episode.season < 10 ? "0" + episode.season : episode.season;

    option.innerText = `S${seasonNum}E${episodeNum} - ${episode.name}`;
    option.value = `S${episode.season}E${episode.number}`;
    episodesSelectTag.appendChild(option);
  });
}

// Show selected episode
function getSelectedEpisode(e, episodesList) {
  let selectedEpisode = e.target.value;
  if (selectedEpisode == -1) {
    makePageForEpisodes(episodesList);
  } else {
    let matchedEpisode = episodesList.find((episode) => {
      let episodeNumber = `S${episode.season}E${episode.number}`;
      return episodeNumber == selectedEpisode;
    });
    makePageForEpisodes([matchedEpisode]);
  }
}

// search for episode by word
function getEpisodeByWord(e, episodesList) {
  let word = e.target.value.toLowerCase();
  let filteredEpisodes = episodesList.filter(
    (episode) =>
      episode.name.toLowerCase().includes(word) ||
      episode.summary.toLowerCase().includes(word)
  );

  // Displaying message only if the search input is not empty
  searchResults.innerText =
    e.target.value == ""
      ? ""
      : `Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes`;

  // Displaying filtered episodes
  if (filteredEpisodes.length == 0) {
    rootElem.innerHTML = "No matching episode";
  } else {
    makePageForEpisodes(filteredEpisodes);
  }
}

// Event listeners
episodesSelectTag.addEventListener("change", (e) => {
  getSelectedEpisode(e, allEpisodes);
  searchResults.innerHTML = "";
  inputSearch.value = "";
});
showsSelectTag.addEventListener("change", (e) => {
  getShowById(e);
  searchResults.innerHTML = "";
  inputSearch.value = "";
});
resetBtn.addEventListener("click", () => {
  makePageForEpisodes(allEpisodes);
  episodesSelectTag.value = -1;
  searchResults.innerHTML = "";
  inputSearch.value = "";
});
homeBtn.addEventListener("click", () => {
  showsSelectTag.value = -1;
  searchResults.innerHTML = "";
  inputSearch.value = "";
  start();
});

window.onload = start;