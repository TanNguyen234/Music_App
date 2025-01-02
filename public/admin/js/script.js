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
    "edit": "Chỉnh sửa"
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
        const url ='/' + pathArray[0] + '/' + pathArray[i]
        const index = pathArray[i]

        if(dictionary[index]) {
            item = dictionary[index]
        }

        if(pathArray[i + 1].length === 24) {
            url += '/' + pathArray[i + 1]
        }

        if(i === pathArray.length - 1) {
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