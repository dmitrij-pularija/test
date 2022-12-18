import throttle from "lodash.throttle";
import "../css/styles.css";
import { getImages } from "./getImages";
import { messages } from "./messages";
import { makehtml } from "./makehtml";
import { refs } from "./refs";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const THROTTLE_DELAY = 500;
let showAuthorInfo = false;
let currentPage = 0;
let totalPage = 0;
let imgs = [];
let settitgsData = {};
const lightbox = new SimpleLightbox(".photo-card .gallery__link", {
  enableKeyboard: true,
  docClose: false,
  captions: true,
  captionSelector: "img",
  captionType: "attr",
  captionsData: "alt",
  captionPosition: "bottom",
  captionDelay: 250,
  close: false,
});

clearSerch();
refs.input.focus();

function clearSerch() {
  refs.gallery.innerHTML = "";
  currentPage = 0;
  totalPage = 0;
  imgs = [];
  refs.scrollIndicator.style.width = "0%";
  showButton(false);
  showCounter(false);
  refs.progressContainer.classList.remove("loading");
  lastSettitgs();
}

function showButton(visible) {
  if (visible) refs.futter.style.display = "flex";
  if (!visible) refs.futter.style.display = "none";
}

function showCounter(visible) {
  if (visible && currentPage !== 0) {
    refs.pageCounter.style.display = "flex";
    refs.imageCounter.style.display = "flex";
  }
  if (!visible) {
    refs.pageCounter.style.display = "none";
    refs.imageCounter.style.display = "none";
  }
}

function changeCounter(
  currentPageValue,
  totalPageValue,
  availableImages,
  totalImages
) {
  refs.pageCurrent.innerHTML = currentPageValue;
  refs.pageTotal.innerHTML = totalPageValue;
  refs.page.innerHTML = currentPageValue;
  refs.pages.innerHTML = totalPageValue;
  refs.imageAvailable.innerHTML = availableImages;
  refs.imageTotal.innerHTML = totalImages;
}

function authorInf(visible) {
  const authors = Array.prototype.slice.call(
    document.querySelectorAll(".overlay")
  );
  if (visible) {
    authors.map((author) => author.classList.remove("visually-hidden"));
  } else {
    authors.map((author) => author.classList.add("visually-hidden"));
  }
}

function searchImages() {
  clearSerch();
  refs.progressContainer.classList.add("loading");
  const imageRequest = refs.input.value.trimRight().trimLeft();
  if (!/^[A-ZА-ЯЁЇІЄ\s]+$/i.test(imageRequest)) {
    messages("error");
    clearSerch();
    return;
  }
  makeArrayOfPromises(imageRequest);
}

async function makeArrayOfPromises(imageRequest) {
  const response = await getImages(imageRequest, "1");
  if (response.total > 0) {
    messages("info", response.total);
  } else {
    messages("error");
    clearSerch();
    return;
  }
  totalPage = Math.ceil(response.totalHits / 40);
  renderImageGalery(response);
  const pageIds = Array.from({ length: totalPage - 1 }, (pageId, index) => {
    return index + 2;
  });
  const promises = pageIds.map(
    async (pageId) => await getImages(imageRequest, pageId)
  );
  imgs = await Promise.all(promises);
  refs.progressContainer.classList.remove("loading");
}

function renderImageGalery(images) {
  if (currentPage < totalPage) {
    currentPage += 1;
    showButton(true);
  }
  if (currentPage === totalPage) showButton(false);

  let total = 0;
  if (totalPage === 13) {
    total = 520;
  } else {
    total = images.totalHits;
  }

  changeCounter(currentPage, totalPage, total, images.total);
  showCounter(refs.loadInfo.checked);
  const markup = images.hits
    .map((image) => makehtml(image, showAuthorInfo))
    .join("");

  refs.gallery.insertAdjacentHTML("beforeend", markup);
  lightbox.refresh("");
}

refs.search.addEventListener("submit", (event) => {
  event.preventDefault();
  searchImages();
});
refs.menu.addEventListener("click", changeSettings);
refs.loadMore.addEventListener("click", () => {
  renderImageGalery(imgs[currentPage - 1]);
});
refs.menuButton.addEventListener("click", settings);

document.addEventListener("keydown", esc);
window.addEventListener("scroll", throttle(checkPosition, THROTTLE_DELAY));
window.addEventListener("scroll", indicator);
window.addEventListener("resize", throttle(checkPosition, THROTTLE_DELAY));

function esc(event) {
  if (event.code === "Escape" && document.querySelector(".sl-image")) {
    event.preventDefault();
    lightbox.close("");
  }
  if (
    event.code !== "ArrowRight" &&
    event.code !== "ArrowLeft" &&
    event.code !== "Escape" &&
    document.querySelector(".sl-image")
  )
    messages("escape");
}

function checkPosition() {
  const threshold = document.body.offsetHeight * 0.8;
  const position = window.scrollY + window.innerHeight;
  if (
    settitgsData.loadType &&
    position >= threshold &&
    currentPage !== totalPage &&
    currentPage !== 0
  ) {
    renderImageGalery(imgs[currentPage - 1]);
  }
}

function indicator() {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let progress = (currentPage / totalPage) * (winScroll / height) * 100;
  refs.scrollIndicator.style.width = progress + "%";
}

function settings() {
  refs.menu.classList.toggle("show");
  const iconAdres = refs.menuIcon.getAttribute("href");
  const iconLink = iconAdres.slice(0, iconAdres.indexOf("#") + 1);
  if (refs.menu.classList.contains("show")) {
    refs.menuIcon.setAttribute("href", iconLink + "close");
  } else {
    refs.menuIcon.setAttribute("href", iconLink + "settings");
  }
}

function changeSettings() {
  settitgsData[loadType.id] = refs.loadType.checked;
  settitgsData[loadInfo.id] = refs.loadInfo.checked;
  settitgsData[authorInfo.id] = refs.authorInfo.checked;
  localStorage.setItem("image-search-settings", JSON.stringify(settitgsData));
  showAuthorInfo = refs.authorInfo.checked;
  showCounter(refs.loadInfo.checked);
  authorInf(refs.authorInfo.checked);
}

function lastSettitgs() {
  const settitgs = JSON.parse(localStorage.getItem("image-search-settings"));
  if (settitgs) {
    refs.loadType.checked = settitgs.loadType;
    refs.loadInfo.checked = settitgs.loadInfo;
    refs.authorInfo.checked = settitgs.authorInfo;
    showAuthorInfo = settitgs.authorInfo;
    settitgsData = settitgs;
  } else changeSettings();
}
