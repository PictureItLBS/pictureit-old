export default function initPosts() {
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
}