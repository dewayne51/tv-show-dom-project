const inputSearch = document.getElementById("search-input");
const selectTag = document.getElementById("episodes");
const resetBtn = document.querySelector(".btn-reset");
const rootElem = document.getElementById("root");
const allEpisodes = getAllEpisodes();

function setup() {
  makePageForEpisodes(allEpisodes);
  selectEpisode(allEpisodes);
}

// Loads episodes cards
function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = "";
  episodeList.map((episode) => {
    let cardElt = document.createElement("div");
    let titleElt = document.createElement("h2");
    let imgElt = document.createElement("div");
    let textElt = document.createElement("div");
    let episodeNum =
      episode.number < 10 ? "0" + episode.number : episode.number;
    let seasonNum = episode.season < 10 ? "0" + episode.season : episode.season;

    cardElt.className = "card";
    titleElt.className = "card__title";
    imgElt.className = "card__img";
    textElt.className = "card__text";
    titleElt.textContent = `${episode.name} - S${seasonNum}E${episodeNum}`;
    imgElt.style.backgroundImage = `url(${episode.image.medium})`;
    textElt.innerHTML = episode.summary;

    cardElt.append(titleElt, imgElt, textElt);
    rootElem.appendChild(cardElt);
  });
}

// Select episode
function selectEpisode(episodeList) {
  episodeList.map((episode) => {
    let option = document.createElement("option");
    let episodeNum =
      episode.number < 10 ? "0" + episode.number : episode.number;
    let seasonNum = episode.season < 10 ? "0" + episode.season : episode.season;

    option.innerText = `S${seasonNum}E${episodeNum} - ${episode.name}`;
    option.value = `S${episode.season}E${episode.number}`;
    selectTag.appendChild(option);
  });
}
// Show selected episode
function showEpisode(e, episodeList) {
  let selectedEpisode = e.target.value;
  if (selectedEpisode == -1) {
    makePageForEpisodes(episodeList);
  } else {
    let matchedEpisode = episodeList.find((episode) => {
      let episodeNumber = `S${episode.season}E${episode.number}`;
      return episodeNumber == selectedEpisode;
    });
    makePageForEpisodes([matchedEpisode]);
  }
}

// search for episode by word
function searchWord(e, episodeList) {
  const searchResults = document.getElementById("search-results");
  let word = e.target.value.toLowerCase();
  let filteredEpisodes = episodeList.filter(
    (episode) =>
      episode.name.toLowerCase().includes(word) ||
      episode.summary.toLowerCase().includes(word)
  );
  searchResults.innerText = `Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes`;
  if (filteredEpisodes.length == 0) {
    rootElem.innerHTML = "No matching episode";
  } else {
    makePageForEpisodes(filteredEpisodes);
  }
}

// Event listeners
inputSearch.addEventListener("input", (e) => searchWord(e, allEpisodes));
selectTag.addEventListener("change", (e) => showEpisode(e, allEpisodes));
resetBtn.addEventListener("click", () => {
  makePageForEpisodes(allEpisodes);
  selectTag.value = -1;
});
window.onload = setup;