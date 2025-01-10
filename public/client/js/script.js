//Lazy loading
window.addEventListener("load", () => {
 document.body.classList.add("loaded");
}); 
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