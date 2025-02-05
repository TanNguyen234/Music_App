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
        if(input.getAttribute("type") !== "password") {
          input.setAttribute("type", attribute);
        }
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
    mini: false,
    autoplay: false,
    theme: '#310623',
    loop: 'all',
    order: 'random',
    preload: 'auto',
    volume: 0.7,
    mutex: true,
    listFolded: false,
    listMaxHeight: 90,
    lrcType: 1,
    audio: [{
      name: dataSong.title,
      artist: dataSong.singer || "",
      url: dataSong.audio,
      cover: dataSong.avatar,
      lrc: dataSong.lyrics
    }],
  });
  console.log(ap);

  //Spin
  const avatar = document.querySelector(".aplayer-pic");

  ap.on("play", () => {
    avatar.style.animationPlayState = "running";
  });

  ap.on("pause", () => {
    avatar.style.animationPlayState = "paused";
  });
}
//End Aplayer

//Nút yêu thích
const buttonLove = document.querySelector(".box-listen__like i");
const buttonLoveOut = document.querySelector(".box-listen__like");
if (buttonLoveOut) {
  const value = buttonLoveOut.getAttribute("favorite");
  if (value === "yes") {
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
const buttonPlayList = document.querySelector("[button-add-playlist]");
if (buttonPlayList) {
  buttonPlayList.addEventListener("click", (e) => {
    const type = buttonPlayList.getAttribute("type");
    const id = window.location.pathname.split("/")[2];
    const link = `/songs/eventSong/${id}?type=playlist&&value=${type}`;

    const span = buttonPlayList.querySelector("span");
    const i = buttonPlayList.querySelector("i");

    fetch(link, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          if (i && span) {
            buttonPlayList.setAttribute(
              "type",
              type === "push" ? "del" : "push"
            );
            const className = i.classList.contains("fa-check");
            if (className) {
              i.classList.remove("fa-check");
              i.classList.add("fa-plus");
            } else {
              i.classList.remove("fa-plus");
              i.classList.add("fa-check");
            }
            span.innerHTML =
              type === "del"
                ? "Thêm vào danh sách phát"
                : "Đã thêm vào danh sách phát";
          }
        }
      });
  });
}
//End Button Playlist
//Filter Song
const filterForm = document.querySelector("form[filter-form]");
if (filterForm) {
  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = filterForm.querySelector("input[name=keyword]").value;
    const topic = filterForm.querySelector("select[name=id]").value;
    var link = "/result";
    const container = document.querySelector(".container.topic__content");

    if (keyword) {
      link += "?keyword=" + keyword;
    }
    if (topic) {
      if (link.length > 8) link += "&";
      else link += "?";
      link += "id=" + topic;
    }

    fetch(link, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200 && container) {
          var div = "";
          if (data.songs.length > 0) {
            data.songs.map((song) => {
              div += `
                <a class="topic__card song__card" href="/songs/${song._id}">
                  <div class="topic__img">
                    <img src=${song.avatar} alt=${song.title}>
                  </div>
                  <div class="topic__card--content">
                    <div class="topic__title--small">${song.title}</div>
                  </div>
                </a>
              `;
            });
          } else {
            div = `<h1 class="text-center">Ops. Hiện tại chưa tìm thấy bài hát nào!</h1>`;
          }
          container.innerHTML = div;
        }
      });
  });
}
//End Filter Song
//Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
  let url = new URL(window.location.href);

  buttonsPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");

      url.searchParams.set("page", page);

      window.location.href = url.href; //Chuyển trang hiện tại đến đường dẫn mới
    });
  });
}
//End Pagination

//Tooltip bootstrap
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);
//End Tooltip bootstrap

// Popup Bootstrap
const popUpInfo = document.getElementById("popup");
if (popUpInfo) {
  popUpInfo.addEventListener("show.bs.modal", (event) => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
  });

  const myModal = new bootstrap.Modal(popUpInfo);

  const btnSubmit = popUpInfo.querySelector("[btn-form]");
  btnSubmit.addEventListener("click", (e) => {
    const fullName = popUpInfo.querySelector(".modal-body #fullName").value;
    const email = popUpInfo.querySelector(".modal-body #email").value;
    var dataPost = {};
    if (fullName) dataPost.fullName = fullName;
    if (email) dataPost.email = email;
    if (dataPost.fullName || dataPost.email) {
      fetch("/user/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataPost),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            if (fullName) {
              const fullName = document.querySelector("p[fullName]");
              fullName.innerHTML = dataPost.fullName;
            }
            if (email) {
              const email = document.querySelector("p[email]");
              email.innerHTML = dataPost.email;
            }
            myModal.hide();
          } else {
          }
        });
    }
  });
}
// End Popup Boostrap

// Change Avatar
//Upload Image //Tạo preview ảnh trước khí upload [(google search)]
const uploadImage = document.querySelector("[upload-image]");

if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector(
    "[upload-image-preview]"
  );

  uploadImageInput.addEventListener("change", (e) => {
    if (uploadImageInput.value) {
      uploadImage.children[4].style.display = "block";
      uploadImage.children[2].style.display = "none";
    }
    let file = e.target.files[0];

    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file); //Hàm tạo đường dẫn ảnh
    }
  });

  const x = uploadImage.children[4].querySelector("span");
  x.addEventListener("click", (e) => {
    uploadImagePreview.src = "";
    uploadImage.children[4].style.display = "none";
    uploadImage.children[2].style.display = "block";
    uploadImageInput.value = "";
  });
  const popUpAvatar = document.getElementById("uploadAvatar");
  if (popUpInfo) {
    popUpInfo.addEventListener("show.bs.modal", (event) => {
      // Button that triggered the modal
      const button = event.relatedTarget;
      // Extract info from data-bs-* attributes
    });

    const myModal2 = new bootstrap.Modal(popUpAvatar);

    const btnSubmit = popUpAvatar.querySelector("[btn-form]");
    btnSubmit.onclick = function handleClick() {
      const formData = new FormData();
      const inputFile = document.querySelector('input[name="avatar"]');

      const file = inputFile.files[0]; // Lấy tệp đầu tiên trong danh sách tệp được chọn

      if (file) {
        formData.append("avatar", file); // Thêm tệp vào FormData
        // Xóa sự kiện onclick tạm thời
        btnSubmit.onclick = null;
        btnSubmit.textContent = "Đang gửi..."; // Cập nhật trạng thái nút
        fetch("/user/edit", {
          method: "POST",
          body: formData,
          headers: {
            // "Content-Type": "multipart/form-data",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              const changeAvatar = document.querySelector(".profile__img img");
              changeAvatar.src = data.data.avatar;
              myModal2.hide();
            } else {
              console.log("error");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          })
          .finally(() => {
            btnSubmit.onclick = handleClick; // Khôi phục sự kiện onclick
            btnSubmit.textContent = "Cập nhật"; // Khôi phục trạng thái nút
          });
      }
    };
  }
}
// End Change Avatar
//Send OTP
function alertFunc(type, message) {
  const alert = document.querySelector(`.alert-user-${type}`);
  if (alert) {
    alert.innerText = message;
    const span = document.createElement("span");
    span.setAttribute("close-alert", "");
    span.innerHTML = 'x';
    alert.appendChild(span);
    alert.toggleAttribute("show-alert")
    clearTimeout();
    // Hiển thị thông báo
    alert.classList.remove("alert-hidden"); // Đảm bảo thông báo hiển thị

    // Đặt thời gian ẩn thông báo
    const timeAlert = alert.getAttribute("data-time");

    setTimeout(() => {
      alert.classList.add("alert-hidden");  // Ẩn thông báo sau thời gian chờ
    }, timeAlert);

    // Ẩn thông báo khi nhấn vào
    alert.addEventListener("click", () => {
      alert.classList.add("alert-hidden");
    });
  }
}
// Gửi OTP và kiểm tra thời gian chờ
var time = 30000;  // Thời gian chờ là 30 giây
let isWaiting = false;  // Kiểm tra xem có đang chờ không

const formForgot = document.querySelector(".form-forgot-password");
if (formForgot) {
  const btnOtp = formForgot.querySelector("button[btn-otp]");
  if (btnOtp) {
    btnOtp.onclick = function handleClick(e) {
      e.preventDefault();
      if (isWaiting) {
        alertFunc("error", `Vui lòng đợi ${Math.ceil(time / 1000)} giây để gửi lại OTP.`);
        return;  // Dừng hành động gửi OTP
      }
      isWaiting = true;
      const email = formForgot.querySelector('input[name="email"]').value;
      if (email) {
        fetch('/user/password/otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email}),
        })
        .then(response => response.json())
        .then(data => {
          if (data.code !== 200) {
            alertFunc("error", data.message);
          } else {
            alertFunc("success","Đã gửi OTP đến email của bạn. Vui lòng kiểm tra email!");
          }
        })
        // Đếm ngược thời gian
        const countdownInterval = setInterval(() => {
          time -= 1000;  // Giảm 1 giây mỗi lần
          if (time <= 0) {
            clearInterval(countdownInterval);
            isWaiting = false;
            time = 30000;  // Reset thời gian về 30 giây
            alertFunc("success", "Bạn có thể gửi lại OTP.");
          }
        }, 1000);
      } else {
        alertFunc("error", "Vui lòng nhập email của bạn!");
      }
    };
  }
  const btnSubmit = formForgot.querySelector('button[type="submit"]');
  if (btnSubmit) {
    btnSubmit.onclick = function handleClick() {
      e.preventDefault();
    };
  }
}
//End Send OTP
//Preview Image
const popUpPreview = document.getElementById("reviewAvatar");
if (popUpPreview) {
  popUpPreview.addEventListener("show.bs.modal", (event) => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
  });
  const myModal3 = new bootstrap.Modal(popUpPreview);
}
//End Preview Image