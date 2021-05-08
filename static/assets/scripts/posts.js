export default function initPosts() {
    // Share buttons
    document.querySelectorAll('.action-share').forEach(element => {
        element.addEventListener('click', ev => {
            const tmpElement = document.createElement('textarea')
            tmpElement.value = `${window.location.origin}/app/post/view/${element.id}`
            document.body.appendChild(tmpElement)
            tmpElement.select()
            document.execCommand("copy")
            document.body.removeChild(tmpElement)
        })
    })

    // Like buttons
    document.querySelectorAll('.action-like').forEach(element => {
        element.addEventListener('click', ev => {
            const classList = element.classList

            if (classList.contains('active')) {
                // Unlike
                classList.remove('active')
            } else {
                // Like
                classList.add('active')
            }
        })
    })
}