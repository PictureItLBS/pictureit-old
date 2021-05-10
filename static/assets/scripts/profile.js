const pfp = document.querySelector('.user-pfp')

fetch(`/api/users/profilePicture/get/string/${pfp.id}`).then(
    result => result.json()
).then(answer => {
    console.log(answer)

    if (!answer.success)
        return pfp.style.backgroundImage = 'url(/assets/resources/logo.png)'

    pfp.style.backgroundImage = `url(${answer.imageURL})`
})