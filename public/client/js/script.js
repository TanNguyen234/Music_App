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
  const ap = new APlayer({
    container: document.getElementById("aplayer"),
    audio: [
      {
        name: dataSong.title,
        artist: dataSong.singer || "",
        url: dataSong.audio,
        cover: dataSong.avatar,
        theme: "#7676",
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

  //Spin
  const avatar = document.querySelector('.aplayer-pic');

  ap.on('play', () => {
      avatar.style.animationPlayState = "running"
  })

  ap.on('pause', () => {
      avatar.style.animationPlayState = "paused"
  })
}
//End Aplayer

//Nút yêu thích
const buttonLove = document.querySelector(".box-listen__like i");
const buttonLoveOut = document.querySelector(".box-listen__like");
if(buttonLoveOut) {
  const value = buttonLoveOut.getAttribute("favorite");
  if(value==="yes") {
    buttonLove.classList.add("fa-solid");
  }
}
if (buttonLove) {
  buttonLove.addEventListener("click", () => {
    const isActive = buttonLove.classList.contains("fa-solid");
    const type = !isActive ? "favorite" : "unfavorite";

    const id = window.location.pathname.split("/")[2];
    const link = `/songs/eventSong/${id}?type=like&&value=${type}`;

    fetch(link, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          buttonLove.innerHTML = data.like;
          buttonLove.classList.toggle("fa-solid");
        }
      });
  });
}
//End Nút yêu thích

//Button Playlist
const buttonPlayList = document.querySelector('[button-add-playlist]')
if(buttonPlayList) {
  buttonPlayList.addEventListener('click', (e) => {
    const type = buttonPlayList.getAttribute('type');
    const id = window.location.pathname.split("/")[2];
    const link = `/songs/eventSong/${id}?type=playlist&&value=${type}`;

    const span = buttonPlayList.querySelector('span');
    const i = buttonPlayList.querySelector('i');

    fetch(link, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          if(i && span) {
            buttonPlayList.setAttribute("type", type === "push" ? "del" : "push")
            const className = i.classList.contains("fa-check");
            if(className) {
              i.classList.remove("fa-check");
              i.classList.add("fa-plus");
            } else {
              i.classList.remove("fa-plus");
              i.classList.add("fa-check");
            }
            span.innerHTML = type === "del" ? "Thêm vào danh sách phát" : "Đã thêm vào danh sách phát";
          }
        }
      });
  });
}
//End Button Playlist