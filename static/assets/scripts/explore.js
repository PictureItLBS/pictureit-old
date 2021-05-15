import loadPfps from "./profilePictures.js"

loadPfps('.user-pfp')

// Make users in user-results from search clickable.
document.querySelectorAll('.user').forEach(element => {
    element.addEventListener('click', event => {
        window.location.href = `${window.location.origin}/app/profile/user/${element.id}`
    })
})