

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
    x.addEventListener('click', (e) => {
        uploadImagePreview.src = ""
        uploadImage.children[2].style.display = 'none';
        uploadImageInput.value = "";
    })
}
//End Upload Image
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
            const form = document.querySelector(`#form-delete-${id}`);
            if(form) {
                btn.addEventListener('click', (e) => {
                    form.submit();
                })
            }
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

            let statusChange = statusCurrent == "active" ? "inactive" : "active";
            const data = {
                id: id,
                status: statusChange
            }

            fetch(action, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
           .then(response => response.json())
           .then(data => {
                if(data.code == 200) {
                    if(statusChange == "active") {
                        button.classList.remove('btn-danger');
                        button.classList.add('btn-success');
                        button.textContent = "Active";
                    } else {
                        button.classList.remove('btn-success');
                        button.classList.add('btn-danger');
                        button.textContent = "Inactive";
                    }
                }
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