import { Notify } from "notiflix/build/notiflix-notify-aio";

export function messages(type, total) {
  switch (type) {
    case "info":
      Notify.success(`✅ Hooray! We found ${total} images.`, {
        useIcon: false,
        cssAnimationStyle: "from-top",
        position: "center-center",
        borderRadius: "25px",
        width: "250px",
      });
      break;

    case "error":
      Notify.failure(
        `❌ Sorry, there are no images matching your search query. Please try again.`,
        {
          useIcon: false,
          cssAnimationStyle: "from-top",
          position: "center-center",
          borderRadius: "25px",
          width: "250px",
        }
      );
      break;

    case "escape":
      Notify.info(`💡 Press "Escape", to exit view mode`, {
        useIcon: false,
        cssAnimationStyle: "from-top",
        position: "center-center",
        borderRadius: "25px",
        width: "250px",
      });
      break;
  }
}
