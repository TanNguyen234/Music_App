// li.breadcrumb-item.active(aria-current="page") Quản lý chủ đề
//Breadcrumb
const breadcrumb = document.querySelector('.breadcrumb');
const path = window.location.pathname;
const pathArray = path.split('/');
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
}
const navItems = document.querySelectorAll('.nav .inner-menu ul li a');
if(navItems.length > 0) {
    navItems.forEach(item => {
        if(item.href === window.location.href) {
            item.classList.add('active');
        }
    })
}
if(breadcrumb && pathArray.length > 1) {
    const breadcrumbItem = breadcrumb.querySelectorAll('.breadcrumb-item');
    for (let i = 2; i < pathArray.length; i++) {
        var htmlItem = ''
        var item = null
        if(dictionary[pathArray[i]]) {
            item = dictionary[pathArray[i]]
        }
        if(i === pathArray.length - 1) {
            htmlItem = `
                <li class="breadcrumb-item active" aria-current="page">${item ? item : pathArray[i]}</li>
            `
        } else {
            htmlItem = `
                <li class="breadcrumb-item">
                    <a href=${pathArray[0]+`/${pathArray[i]}`}>${item ? item : pathArray[i]}</a>
                </li>
            `
        }
        
        breadcrumb.insertAdjacentHTML('beforeend', htmlItem);
    }
}
//End Breadcrumb