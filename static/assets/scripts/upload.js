import popup from './popup.js';

document.querySelector(".upload-popup-btn").addEventListener("click", evt=>{
  evt.preventDefault()
  popup.show("upload")
})

document.querySelector(".upload-cancel-btn").addEventListener("click", evt=>{
  evt.preventDefault()
  popup.hide()
})

document.querySelectorAll(".input-upload-image").forEach((el, i) => {
  console.log(i,el)
  el.addEventListener("change",evt=>{
    console.log(el, "change")
    let input = evt.target
    if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      input.parentElement.querySelector(".upload-preview-image").src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
  })
});
