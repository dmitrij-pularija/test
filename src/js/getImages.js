import axios from "axios";

export async function getImages(imageRequest, page) {
  return await axios
    .get("https://pixabay.com/api/", {
      params: {
        key: "31279571-1cfba33362a16abb8b6f73723",
        q: `${imageRequest}`,
        lang: "en",
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: "40",
        page: `${page}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
}
