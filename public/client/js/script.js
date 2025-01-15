//Lazy loading
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
//End Lazy loading
const inputs = document.querySelectorAll("input");
window.addEventListener("DOMContentLoaded", () => {
  if (inputs.length > 0) {
    inputs.forEach((input) => {
      const attribute = input.getAttribute("id");
      input.addEventListener("focus", () => {
        input.setAttribute("type", attribute);
        // input.addEventListener('invalid', () => {
        //   // Đảm bảo rằng thông báo lỗi được cập nhật khi trường không hợp lệ
        //   input.setCustomValidity("Vui lòng nhập " + attribute);
        // });
      });
    });
  }
});
//End Chặn auto fill
//Aplayer
const aplayer = document.getElementById("aplayer");
if (aplayer) {
  const dataSong = JSON.parse(aplayer.getAttribute("data-song"));
  console.log(dataSong);
  const ap = new APlayer({
    container: document.getElementById("aplayer"),
    audio: [
      {
        name: dataSong.title,
        artist: dataSong.singer || "",
        url: dataSong.audio,
        cover: dataSong.avatar,
        theme: "#000",
        loop: "all",
        preload: "auto",
        volume: 0.7,
        mutex: true,
        listFolded: false,
        listMaxHeight: 90,
        lrcType: 3,
      },
    ],
  });
}
//End Aplayer
