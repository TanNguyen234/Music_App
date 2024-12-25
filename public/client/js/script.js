//Lazy loading
function loadDelayed() {
    const tag = "<script src='delayed.js'></script>";
    document.querySelector("head").insertAdjacentHTML("beforeend", tag);
  }
  // E.g. trigger via timeout after 5 seconds
  setTimeout(loadDelayed, 5000);
//End Lazy loading