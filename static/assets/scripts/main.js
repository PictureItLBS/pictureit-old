import loadIcons from './icons.js'
import initPosts from './posts.js'
import initQuickies from './quickies.js'
import initUpload from './upload.js'

initPosts()
loadIcons()
initQuickies()
initUpload()

if (window.location.pathname.includes('app')) {
    const currentView = document.body.getAttribute("view")

    document.querySelector(`.sidebar-entry-${currentView}`).classList.add("active")
}