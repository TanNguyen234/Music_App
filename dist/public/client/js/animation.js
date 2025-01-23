//Close Alert
const showAleart = document.querySelector("[show-alert]");
if (showAleart) {
  const closeAlert = showAleart.querySelector("[close-alert]");
  if (closeAlert) {
    clearTimeout();
    const timeAlert = showAleart.getAttribute("data-time");
    setTimeout(() => {
      showAleart.classList.add("alert-hidden");
    }, timeAlert);

    closeAlert.addEventListener("click", (e) => {
      showAleart.classList.add("alert-hidden");
    });
  }
}
//End Close Alert

//Header Nav
const headerNav = document.querySelectorAll(".header__nav ul li");

if (headerNav.length > 0) {
  headerNav.forEach((item) => {
    const nextItem = item.querySelector('a');
    if(nextItem.getAttribute('href') === window.location.pathname) {
      nextItem.classList.add('active')
    }
    if(!nextItem.classList.contains('active')) {
      item.addEventListener("mouseenter", () => {
        item.querySelector("a").style.color = "#fff";
        anime({
          targets: item,
          translateY: [-10, 0, 10, 0],
          opacity: [1, 0, 0, 1],
          duration: 600,
          easing: "linear",
          easing: "easeInOutQuad",
        });
      });
      item.addEventListener("mouseout", () => {
        anime({
          targets: item,
          translateY: 0,
          duration: 100,
          easing: "linear",
        });
      });
      item.addEventListener("mouseleave", () => {
        item.querySelector("a").style.color = "gray";
      });
    }
  });
}
//End Header Nav
//Header Login
const headerLogin = document.querySelector(".header__login");

if (headerLogin) {
  const icon = headerLogin.querySelector("i");
  const text = headerLogin.querySelector("a");
  if (text && icon) {
    headerLogin.addEventListener("mouseenter", () => {
      anime({
        targets: text,
        translateY: [-10, 0, 10, 0],
        opacity: [1, 0, 0, 1],
        duration: 600,
        easing: "linear",
        easing: "easeInOutQuad",
      });
      anime({
        targets: icon,
        translateX: [-10, 0, 10, 0],
        opacity: [1, 0, 0, 1],
        duration: 600,
        easing: "linear",
        easing: "easeInOutQuad",
      });
    });
    headerLogin.addEventListener("mouseout", () => {
      anime({
        targets: text,
        translateY: 0,
        duration: 100,
        easing: "linear",
      });
      anime({
        targets: icon,
        translateX: 0,
        duration: 100,
        easing: "linear",
      });
    });
  }
}
// End Header Login
//Dashboard Content
const dashboardContent = document.querySelectorAll(".dashboard__animation div");
const lazytime = 1100;
function runAnimation() {
  setTimeout(() => {
    if (dashboardContent.length > 0) {
      dashboardContent.forEach((item) => {
        anime({
          targets: item,
          translateX: function (el) {
            return anime.random(-250, 250);
          },
          translateY: function (el, i) {
            return anime.random(-250, 250) + anime.random(-250, 250) * i;
          },
          scale: function (el, i, l) {
            return l - i + 0.25;
          },
          rotate: function () {
            return anime.random(-360, 360);
          },
          borderRadius: function () {
            return ["50%", anime.random(10, 35) + "%"];
          },
          duration: function () {
            return anime.random(1200, 1800);
          },
          delay: function () {
            return anime.random(0, 400);
          },
          direction: "alternate",
          loop: true,
        });
      });
    }
  }, lazytime);
}

if (document.readyState === "complete") {
  // Nếu trạng thái đã là "complete", chạy luôn
  runAnimation();
} else {
  // Nếu chưa, đợi sự kiện load
  window.addEventListener("load", runAnimation);
}

//End Dashboard Content
//Introduction
const items = document.querySelectorAll(".introduction__desc--in");
const windows = document.querySelectorAll(".introduction__desc--img .window");

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show"); // Thêm class 'show' khi phần tử vào viewport
        // observer.unobserve(entry.target); // Ngừng quan sát sau khi đã hiện
      } else {
        entry.target.classList.remove("show"); // Xóa class 'show' khi phần tử không còn trong viewport
      }
    });
  },
  {
    threshold: 0.99,
  }
);

if (items.length > 0) {
  items.forEach((item) => observer.observe(item));
}

if (windows.length > 0) {
  windows.forEach((window) => observer.observe(window));
}
//End Introduction