//Lazy loading
function loadDelayed() {
    const tag = "<script src='delayed.js'></script>";
    document.querySelector("head").insertAdjacentHTML("beforeend", tag);
  }
  // E.g. trigger via timeout after 5 seconds
  setTimeout(loadDelayed, 5000);
//End Lazy loading
const inputs = document.querySelectorAll("input");
window.addEventListener('DOMContentLoaded', () => {
  if(inputs.length > 0) {
    inputs.forEach(input => {
      const attribute = input.getAttribute('id')
      input.addEventListener('focus', () => {
        input.setAttribute('type', attribute);
        // input.addEventListener('invalid', () => {
        //   // Đảm bảo rằng thông báo lỗi được cập nhật khi trường không hợp lệ
        //   input.setCustomValidity("Vui lòng nhập " + attribute);
        // });
      })
    });
  }
});
//End Chặn auto fill