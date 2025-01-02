const listTextareMCE = document.querySelectorAll('[textarea-mce]');

if(listTextareMCE.length > 0) {
  listTextareMCE.forEach((textarea) => {
    const id = textarea.id
    tinymce.init({
      selector: `#${id}`, //Cho thẻ textarea có class=textarea-mce
      plugins: "advlist link image lists code", //Để thêm tính năng insert img
      image_title: true,
      images_upload_url: '/admin/upload',
      automatic_uploads: true,
      file_picker_types: "image",
    });
  })
}