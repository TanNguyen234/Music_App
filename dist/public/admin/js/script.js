// li.breadcrumb-item.active(aria-current="page") Quản lý chủ đề
//Breadcrumb
const breadcrumb = document.querySelector('.breadcrumb');
const path = window.location.pathname;
const array = path.split('/');
const pathArray = array.filter(item => item !== '');
const dictionary = {
    "dashboard": "Trang chủ",
    "topics": "Quản lý chủ đề",
    "songs": "Quản lý bài hát",
    "users": "Quản lý người dùng",
    "accounts": "Quản lý tài khoản admin",
    "roles": "Quản lý vai trò",
    "permissions": "Quản lý quyền",
    "singers": "Quản lý ca sĩ",
    "settings": "Cài đặt",
    
    "create": "Tạo mới",
    "edit": "Chỉnh sửa",
    "detail": "Chi tiết",
}
const navItems = document.querySelectorAll('.nav .inner-menu ul li a');
if(navItems.length > 0) {
    navItems.forEach(item => {
        if(item.href === window.location.href) {
            item.classList.add('active');
        }
    })
}
if(breadcrumb && pathArray.length > 0) {
    for (let i = 1; i < pathArray.length; i++) {
        if(pathArray[1] === "auth") break;
        var htmlItem = ''
        var item = null;
        var url = '/' + pathArray[0]
        const index = pathArray[i]

        if(dictionary[index]) {
            item = dictionary[index]   
        }

        if(pathArray[i + 1] && pathArray[i + 1].length === 24) {
            url = url +  '/' + pathArray[i - 1] + '/' + pathArray[i] + '/' + pathArray[i + 1]
        } else {
            url += '/' + pathArray[i]
        }

        if(i === pathArray.length - 1 || (pathArray[i + 1] && pathArray[i + 1].length === 24)) {
            htmlItem = `
                <li class="breadcrumb-item active" aria-current="page">${item ? item : index}</li>
            `
        } else {
            htmlItem = `
                <li class="breadcrumb-item">
                    <a href=${url}>${item ? item : index}</a>
                </li>
            `
        }
        
        breadcrumb.insertAdjacentHTML('beforeend', htmlItem);
        if(pathArray[i + 1] && pathArray[i + 1].length === 24) {
            break;
        }
    }
}
//End Breadcrumb
//Upload Image //Tạo preview ảnh trước khí upload [(google search)]
const uploadImage = document.querySelector('[upload-image]');

if(uploadImage) {
    const uploadImageInput = uploadImage.querySelector('[upload-image-input]');
    const uploadImagePreview = uploadImage.querySelector('[upload-image-preview]');

    uploadImageInput.addEventListener('change', (e) => {
        uploadImage.children[2].style.display = 'flex';
        let file = e.target.files[0];
        
        if(file) {
            uploadImagePreview.src = URL.createObjectURL(file)//Hàm tạo đường dẫn ảnh
        }
    })
    
    const x = uploadImage.children[2].children[1];
    if(x) {
        x.addEventListener('click', (e) => {
            uploadImagePreview.src = ""
            uploadImage.children[2].style.display = 'none';
            uploadImageInput.value = "";
        })
    }
}
//End Upload Image
//Alert Defined
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
let isWaiting = false;  // Kiểm tra xem có đang chờ không
//End Alert Defined
//Close Alert
const showAleart = document.querySelector('[show-alert]');
if(showAleart) {
    const closeAlert = showAleart.querySelector('[close-alert]');
    if(closeAlert) {
        clearTimeout();
        const timeAlert = showAleart.getAttribute('data-time');
        setTimeout(() => {
            showAleart.classList.add('alert-hidden');

        }, timeAlert);
    
        closeAlert.addEventListener('click', (e) => {
            showAleart.classList.add('alert-hidden');
        })
    }
}
//End Close Alert
//Btn Xóa
const btns = document.querySelectorAll('[btn-delete]');
if(btns && btns.length > 0) {
    btns.forEach(btn => {
        const id = btn.getAttribute('btn-delete');
        if(id) {
            const path = btn.getAttribute('path');
                btn.addEventListener('click', (e) => {
                fetch(path, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                 .then(response => response.json())
                 .then(data => {
                    if(data.code === 200) {
                        alertFunc('success', data.message);
                        btn.closest('tr').remove();
                    } else {
                        alertFunc('error', data.message);
                    }
                 })
            })
        }
    })
}
//End Btn Xóa
//Upload Audio
const uploadAudio = document.querySelector('[upload-audio]');

if(uploadAudio) {
    const uploadAudioInput = uploadAudio.querySelector('[upload-audio-input]');
    const uploadAudioPlay = uploadAudio.querySelector('audio[upload-audio-play]');
    const source = uploadAudioPlay.querySelector('source');
    const update = uploadAudio.querySelector('[update]');

    uploadAudioInput.addEventListener('change', (e) => {
        uploadAudio.children[2].style.display = 'flex';
        let file = e.target.files[0];

        if(file) {
            source.src = URL.createObjectURL(file)//Hàm tạo đường dẫn
            uploadAudioPlay.load()
        }        
    })

    const x = uploadAudio.querySelector('span')

    x.addEventListener('click', () => {
        update.style.display = 'none';
        source.src = ""
        uploadAudioInput.value = "";
        uploadAudioPlay.pause(); // Pause the audio if it's playing
        uploadAudioPlay.currentTime = 0; // Reset playback to the beginning
    })
}
//End Upload Audio
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
//Sort
const sort = document.querySelector('[sort]');
if(sort) {
    const select = document.querySelector('[sort-select]');
    const buttonSortClear = document.querySelector('[sort-clear]');

    let url = new URL(window.location.href);

    select.addEventListener('change', (e) => {
       const [sortKey, sortValue] = e.target.value.split('-')
       
       url.searchParams.set("sortKey", sortKey);
       url.searchParams.set("sortValue", sortValue);

       window.location.href = url.href
    });

    buttonSortClear.addEventListener('click', () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");     
        
        window.location.href = url.href
    })

    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if(sortKey && sortValue) {
        const string = `${sortKey}-${sortValue}`;
        const option = select.querySelector(`option[value="${string}"]`);
        option.selected = true;
    }
}
//End Sort
//Change Status
const buttonsChangeStatus = document.querySelectorAll('[button-change-status]');

if(buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path")

    buttonsChangeStatus.forEach(button => {
        button.addEventListener('click', () => {
            const statusCurrent = button.getAttribute('data-status');
            const id = button.getAttribute('data-id');

            const statusChange = statusCurrent == "active" ? "inactive" : "active";

            const dataSend = {
                id: id,
                status: statusChange
            }

            fetch(path, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataSend)
            })
           .then(response => response.json())
           .then(data => {
                if(data.code == 200) {
                    if(statusChange == "active") {
                        button.classList.remove('btn-danger');
                        button.classList.add('btn-success');
                        button.textContent = "Hoạt động";
                    } else {
                        button.classList.remove('btn-success');
                        button.classList.add('btn-danger');
                        button.textContent = "Dừng hoạt động";
                    }
                    alertFunc("success", data.message);
                } else {
                    alertFunc("error", data.message);
                }
                button.setAttribute('data-status', statusChange);
           })
        })
    })
}
//End Change Status
//Button Status
const buttonStatus = document.querySelectorAll("[button-status]");
if(buttonStatus.length > 0) {

    let url = new URL(window.location.href); //Ghi new URL mới sử dụng được các hàm set bên dưới

    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            button.classList.toggle("active")
            const status = button.getAttribute("button-status");//Lấy ra thuộc tính button-status của button bị click
            
            if(status){
                url.searchParams.set("status", status);  //Thêm param status
            } else {
                url.searchParams.delete("status"); //Xóa param status
            }
            window.location.href = url.href;  //Chuyển trang hiện tại đến đường dẫn mới
        })
    })
}
//End Button Status
//Checkbox Multi
const checkboxMulti = document.querySelector('[checkbox-multi]')

if(checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    
    const inputsId = checkboxMulti.querySelectorAll('input[name="ids"]')
    
    inputCheckAll.addEventListener('click', () => {
        
        if(inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true
            })
        } else {
            inputsId.forEach(input => {
                input.checked = false
            })
        }
    })

    inputsId.forEach(input => {
        input.addEventListener('click', () => {
            const countChecked = checkboxMulti.querySelectorAll('input[name="ids"]:checked').length;
            
            if(countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        })
    })
 
}
//End Checkbox Multi
//Form Change Multi
const formChangeMulti = document.querySelector('[form-change-multi]');

if(formChangeMulti) {
    formChangeMulti.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const checkboxMulti = document.querySelector('[checkbox-multi]');
        const inputsChecked = checkboxMulti.querySelectorAll('input[name="ids"]:checked');

        const typeChange = e.target.elements.type.value;  //Kiểm tra giá trị của typeChange để xử lý theo yêu cầu của bạn    
        
        if(typeChange == "delete-all") {
            const isConfirm = confirm("Are you sure you want to delete");

            if(!isConfirm) {
                return;
            }
        }

        if(inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector('input[name="ids"]');
            
            inputsChecked.forEach(input => {
                const id = input.value;

                if(typeChange == "change-position") {
                    const position = input.closest('tr').querySelector('input[name="position"]').value;//input.closest('tr') là đi ra thẻ cha "tr" gần nhât
                    
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(input.defaultValue);
                }
               
            })

            inputIds.value = ids.join(', ') //Vì giá trị của input không thể là array nên convert thành string

            formChangeMulti.submit(); //Submit form
        } else {
            alertFunc("error", "Vui lòng chọn ít nhất 1 bản ghi!")
        }
    })   
}
//End Change Form Multi
//Permissions Default
const permissionsFunction = (data) => {
    const tablePermission = document.querySelector('[table-permissions]');
    if(tablePermission) {
        data.forEach((item, index) => {
            const permissions = item.permissions;
            permissions.forEach(permission => {
                const row = tablePermission.querySelector(`[data-name=${permission}]`)
                const inputs = row.querySelectorAll('input');
                inputs[index].checked = true
            })
        })
    }
}
const dataRoles = document.querySelector('[data-roles]');
if(dataRoles) {
    const dataRolesValue = dataRoles.getAttribute('data-roles');
    const dataConvert = JSON.parse(dataRolesValue);
    permissionsFunction(dataConvert);
}
//End Permissions Default
//Permissions
const tablePermission = document.querySelector('[table-permissions]')
if(tablePermission) {
    const path = tablePermission.getAttribute('path');
    const buttonSubmit = document.querySelector('[button-submit]');
    buttonSubmit.addEventListener('click', (e) => {
        let permissions = [];

        const rows = tablePermission.querySelectorAll('[data-name]');
        rows.forEach(row => {
            const name = row.getAttribute('data-name');
            const inputs = row.querySelectorAll('input');
            
            if(name === "id") {
                inputs.forEach(input => {
                    const id = input.value
                    permissions.push({
                        id: id,
                        permissions: []
                    })
                })
            } else {
                inputs.forEach((input, index) => {
                    const checked = input.checked;
                    if(checked) {
                        permissions[index].permissions.push(name);
                    }
                })
            }
        })
        if(permissions.length > 0) {
            fetch(path, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(permissions)
            })
            .then(response => response.json())
            .then(data => {
                if(data.code == 200) {
                    alertFunc("success", data.message);
                    
                } else {
                    alertFunc("error", data.message);
                }
            })
        }
    })
}

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
    const phone = popUpInfo.querySelector(".modal-body #phone").value;
    var dataPost = {};
    if (fullName) dataPost.fullName = fullName;
    if (email) dataPost.email = email;
    if (phone) dataPost.phone = phone;
    var path = window.location.pathname.split("/");
    if (dataPost.fullName || dataPost.email || dataPost.phone) {
      fetch(`/${path[1]}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataPost),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            console.log("info", data, dataPost)
            if (fullName) {
              const fullName = document.querySelector("p[fullName]");
              fullName.innerHTML = dataPost.fullName;
            }
            if (email) {
              const email = document.querySelector("p[email]");
              email.innerHTML = dataPost.email;
            }
            if (phone) {
              const phone = document.querySelector("p[phone]");
              phone.innerHTML = dataPost.phone;
            }
            myModal.hide();
            alertFunc("success", data.message);
          } else {
            alertFunc("error", data.message);
          }
        });
    }
  });
}
// End Popup Boostrap
// Change Avatar
//Upload Image //Tạo preview ảnh trước khí upload [(google search)]
const uploadImageAvatar = document.querySelector("[upload-image]");

if (uploadImageAvatar) {
  const uploadImageInput = uploadImageAvatar.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImageAvatar.querySelector(
    "[upload-image-preview]"
  );

  uploadImageInput.addEventListener("change", (e) => {
    if (uploadImageInput.value) {
      uploadImageAvatar.children[4].style.display = "block";
      uploadImageAvatar.children[2].style.display = "none";
    }
    let file = e.target.files[0];

    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file); //Hàm tạo đường dẫn ảnh
    }
  });

  const x = uploadImageAvatar.children[4].querySelector("span");
  x.addEventListener("click", (e) => {
    uploadImagePreview.src = "";
    uploadImageAvatar.children[4].style.display = "none";
    uploadImageAvatar.children[2].style.display = "block";
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
        const path = window.location.pathname.split('/');
        fetch(`/${path[1]}/auth/profile`, {
          method: "PATCH",
          body: formData,
          headers: {
            // "Content-Type": "multipart/form-data",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              const changeAvatar = document.querySelector(".profile__img img");
              const reviewAvatarReload = document.querySelector("#reviewAvatar img")
              reviewAvatarReload.src = changeAvatar.src = data.data.avatar;
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
// Change Avatar