let fetchedProfilePicture = []

export default function loadPfps(query) {
    document.querySelectorAll(query).forEach(async element => {
        if (fetchedProfilePicture[element.id])
            return element.style.backgroundImage = `url(${fetchedProfilePicture[element.id]})`

        const pfpReq = await fetch(`/api/users/profilePicture/get/string/${element.id}`)
        const pfp = await pfpReq.json()

        if (!pfp.success)
            return console.log(pfp.error)

        fetchedProfilePicture[element.id] = pfp.imageURL
        element.style.backgroundImage = `url(${fetchedProfilePicture[element.id]})`
        })
}