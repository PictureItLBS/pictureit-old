import loadPfps from "./profilePictures.js"

loadPfps('.user-pfp')

document.querySelectorAll('.user').forEach(element => {
    element.addEventListener('click', event => {
        window.location.href = `${window.location.origin}/app/profile/user/${element.id}`
    })
})