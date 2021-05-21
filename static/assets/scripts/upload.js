import popup from './popup.js';

export default function initUpload() {
    document.querySelector(".quickie-button#add-post").addEventListener("click", ev => {
        ev.preventDefault()
        popup.show("upload")
    })
    
    document.querySelector(".upload-cancel-btn").addEventListener("click", ev => {
        ev.preventDefault()
        popup.hide()
    })
    
    document.querySelector(".input-upload-image").addEventListener("change", ev => {
        const input = ev.target
        if (input?.files[0]) {
            const reader = new FileReader()
            reader.onload = (e) => document.querySelector(".upload-preview-image").style.backgroundImage = `url(${e.target.result})`
            reader.readAsDataURL(input.files[0])
        }
    })
}