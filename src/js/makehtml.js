import { refs } from "./refs";
export function makehtml(image, show) {
  let addStyle = "";
  const iconHref = refs.menuIcon.getAttribute("href");
  const iconRef = iconHref.slice(0, iconHref.indexOf("#") + 1);
  if (!show) addStyle = " visually-hidden";

  return `
  <div class="photo-card">
    <a href="${image.largeImageURL}" class="gallery__link">
    <img class="gallery__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="overlay${addStyle}">
  <div class="info-card">
  <img class="user__image" src="${image.userImageURL}" loading="lazy" />
  <h3 class="user__name">${image.user}</h3>
  </div>
  </div>
  <div class="info">
    <p class="info-item">
    <svg width="15" height="15" class="likes__icon">
    <use href="${iconRef}heart"></use>
  </svg><b>${image.likes}</b>
    </p>
    <p class="info-item">
    <svg width="18" height="18" class="views__icon">
    <use href="${iconRef}eye"></use>
  </svg><b>${image.views}</b>
    </p>
    <p class="info-item">
    <svg width="15" height="15" class="comments__icon">
    <use href="${iconRef}chat"></use>
  </svg><b>${image.comments}</b>
    </p>
    <p class="info-item">
    <svg width="15" height="15" class="downloads__icon">
    <use href="${iconRef}download"></use>
  </svg><b>${image.downloads}</b>
    </p>
  </div></a></div>`;
}
