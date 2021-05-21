import popup from './popup.js';

const downloadLink = document.querySelector('#download-my-data')

downloadLink.addEventListener('click', event => {
    event.preventDefault()
    popup.show('download-data')
})

document.querySelectorAll('.popup-action-no').forEach(element =>
    element.addEventListener('click', ev => popup.hide(ev))
)

document.querySelector('.popup-action-download-data').addEventListener('click', ev => {
    window.location.href = downloadLink.href
    popup.hide()
})

document.querySelector('.change-pass-btn').addEventListener('click', ev => popup.show('change-pass'))
document.querySelector('.change-pfp-btn').addEventListener('click', ev => popup.show('change-pfp'))
document.querySelector('.change-name-btn').addEventListener('click', ev => popup.show('change-name'))
