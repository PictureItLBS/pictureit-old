let loadedIcons = {}

export default function loadIcons() {
    document.querySelectorAll("span.icon").forEach(async element => {
        const iconToLoad = element.getAttribute("icon")

        // If the loaded icon has already been loaded; don't load it again. :)
        if (loadedIcons[iconToLoad])
            return element.innerHTML = loadedIcons[iconToLoad]

        const iconSource = await fetch(`/assets/icon/${iconToLoad}.svg`)
        const iconCode = await iconSource.text()

        // Set the cache of the icon, and then add it to the element.
        loadedIcons[iconToLoad] = iconCode
        return element.innerHTML = iconCode
    })
}