/*
    Profile Pictures
*/

const pfp = document.querySelector('.user-pfp')
fetch(`/api/users/profilePicture/get/string/${pfp.id}`).then(
    result => result.json()
).then(answer => {
    console.log(answer)

    if (!answer.success)
        return pfp.style.backgroundImage = 'url(/assets/resources/logo.png)'

    pfp.style.backgroundImage = `url(${answer.imageURL})`
})



/*
    User Actions (Buttons)
*/
document.querySelector('.action-mydata')?.addEventListener('click', ev => window.location.pathname = '/app/profile/mydata')

document.querySelectorAll('.action-follow').forEach(element => {
    element.addEventListener('click', async ev => {
        const classList = element.classList

        if (classList.contains('active')) {
            // Unfollow
            const unfollowReq = await fetch(
                `/api/users/unfollow/${element.id}`,
                {
                    method: 'DELETE'
                }
            )

            const status = await unfollowReq.json()

            if (!status.success)
                return console.log(status)

            classList.remove('active')
            element.innerHTML = "Följ"
            const followersAmount = document.querySelector(`span.followers-amount[postID="${element.id}"]`)
            followersAmount.innerHTML = parseInt(followersAmount.innerHTML) - 1
        } else {
            // Follow
            const followReq = await fetch(
                `/api/users/follow/${element.id}`,
                {
                    method: 'POST'
                }
            )

            const status = await followReq.json()

            if (!status.success)
                return console.log(status)

            classList.add('active')
            element.innerHTML = "Avfölj"
            const followersAmount = document.querySelector(`span.followers-amount[postID="${element.id}"]`)
            followersAmount.innerHTML = parseInt(followersAmount.innerHTML) + 1
        }
    })
})

const validateButton = document.querySelector('.action-validate')
validateButton?.addEventListener('click', async ev => {
    const validateReq = await fetch(
        `/api/users/validate/${validateButton.id}`,
        {
            method: 'POST'
        }
    )
    const status = await validateReq.json()

    if (!status.success)
        return console.log(status.error)

    window.location.reload()
})

const promoteButton = document.querySelector('.action-promote')
promoteButton?.addEventListener('click', async ev => {
    const promoteReq = await fetch(
        `/api/users/promote/${promoteButton.id}`,
        {
            method: 'POST'
        }
    )
    const status = await promoteReq.json()

    if (!status.success)
        return console.log(status.error)

    window.location.reload()
})