export default function initPosts() {
    // Like buttons
    document.querySelectorAll('.action-like').forEach(element => {
        element.addEventListener('click', async ev => {
            const classList = element.classList

            if (classList.contains('active')) {
                // Unlike
                const unlikeReq = await fetch(
                    `/api/posts/unlike/${element.id}`,
                    {
                        method: 'DELETE'
                    }
                )

                const status = await unlikeReq.json()

                if (!status.success)
                    return console.log(status)

                classList.remove('active')
                const likeAmount = document.querySelector(`span.like-amount[postID="${element.id}"]`)
                likeAmount.innerHTML = parseInt(likeAmount.innerHTML) - 1
            } else {
                // Like
                const likeReq = await fetch(
                    `/api/posts/like/${element.id}`,
                    {
                        method: 'POST'
                    }
                )

                const status = await likeReq.json()

                if (!status.success)
                    return console.log(status)

                classList.add('active')
                const likeAmount = document.querySelector(`span.like-amount[postID="${element.id}"]`)
                likeAmount.innerHTML = parseInt(likeAmount.innerHTML) + 1
            }
        })
    })

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

    // Delete buttons
    document.querySelectorAll('.action-delete').forEach(element => {
        element.addEventListener('click', async ev => {
            const deleteReq = await fetch(
                `/api/posts/delete/${element.id}`,
                {
                    method: 'DELETE'
                }
            )

            const status = await deleteReq.json()

            if (!status.success)
                return console.log(status)

            window.location.reload()
        })
    })
}